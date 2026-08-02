import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

try {
  fs.copyFileSync(
    "C:\\Users\\PC2301.HOME-OFFICE\\.gemini\\antigravity-ide\\brain\\c489435f-632c-4034-9686-5534f2d45cbd\\kjapan_app_icon_v2_1785650587146.png",
    "d:\\c-바탕화면\\disasterguard-jp\\public\\kjapan_app_icon.png"
  );
  console.log("✅ 앱 아이콘이 public 폴더에 성공적으로 복사되었습니다!");
} catch(e) {
  console.log("이미지 복사 실패:", e);
}
import {
  getOrCreateUser,
  getUserById,
  activate10DayLicense,
  getAdminDashboardStats,
  createEmergencyAlert
} from "./server/config/firebase.js";
import {
  startJmaPolling,
  fetchLiveJmaAlert,
  getLatestJmaAlert
} from "./server/services/jmaService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Start JMA Realtime Pipeline Polling
startJmaPolling(8000);

// Initialize Gemini Client lazily or gracefully handle missing key
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "KJapan Backend with JMA Realtime Pipeline, Firebase & PayPal" });
});

// ==========================================
// 1. JMA (일본 기상청) Live Real-time API
// ==========================================
app.get("/api/jma/live", async (req, res) => {
  try {
    let alert = getLatestJmaAlert();
    if (!alert) {
      alert = await fetchLiveJmaAlert();
    }
    res.json({
      success: true,
      liveAlert: alert,
      source: "JMA Open Data Realtime Pipeline"
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Server-Sent Events (SSE) Live Stream Endpoint for Realtime Push
app.get("/api/jma/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendAlert = () => {
    const alert = getLatestJmaAlert();
    res.write(`data: ${JSON.stringify(alert)}\n\n`);
  };

  sendAlert();
  const interval = setInterval(sendAlert, 5000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

// ==========================================
// 2. Kakao OAuth 2.0 Login API
// ==========================================
app.post("/api/auth/kakao", async (req, res) => {
  try {
    const { code, mockUser } = req.body;

    // Fast-path / Mock Login for Sandbox testing & Instant onboarding
    if (mockUser || !code) {
      const kakaoData = mockUser || {
        id: "77492100",
        nickname: "일본여행자",
        email: "traveler@kakao.com",
        profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
      };

      const user = await getOrCreateUser(kakaoData);
      return res.json({
        success: true,
        user,
        token: `mock_jwt_token_${user.uid}`,
        message: "카카오 로그인 및 Firebase 데이터 연동 완료"
      });
    }

    // Live Kakao OAuth Token Exchange
    const KAKAO_CLIENT_ID = process.env.KAKAO_REST_API_KEY || "dummy_kakao_key";
    const KAKAO_REDIRECT_URI = req.body.redirectUri || process.env.KAKAO_REDIRECT_URI || "http://localhost:3000/";

    const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: KAKAO_REDIRECT_URI,
        code
      })
    });

    const tokenData: any = await tokenResponse.json();
    if (tokenData.error) {
      console.error("Kakao Token API Error:", tokenData);
      return res.status(400).json({ error: tokenData.error_description || "Kakao token error" });
    }

    // Get Kakao User Profile
    const profileResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile: any = await profileResponse.json();

    const kakaoData = {
      id: profile.id,
      nickname: profile.properties?.nickname || "카카오 여행자",
      email: profile.kakao_account?.email,
      profileImage: profile.properties?.profile_image
    };

    const user = await getOrCreateUser(kakaoData);
    res.json({ success: true, user, token: tokenData.access_token });
  } catch (error: any) {
    console.error("Kakao Auth Error:", error);
    res.status(500).json({ error: error.message || "Kakao Auth Failed" });
  }
});

// User Info Check API
app.get("/api/user/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  const uid = authHeader ? authHeader.replace("Bearer ", "") : "kakao_77492100";
  const user = await getUserById(uid);
  res.json({ user });
});

// ==========================================
// 3. PayPal $1.00 USD 10-Day License Payment API
// ==========================================
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

async function generatePayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error("PayPal Client ID or Secret is not configured.");
  }
  
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  
  const data: any = await response.json();
  if (data.error) {
    throw new Error(`PayPal Auth Error: ${data.error_description}`);
  }
  return data.access_token;
}

app.post("/api/payments/paypal/create-order", async (req, res) => {
  try {
    const accessToken = await generatePayPalAccessToken();
    const { amount = "1.00", currency = "USD" } = req.body;

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
            description: "KJapan 10일 프리미엄 1회성 라이선스",
          },
        ],
      }),
    });

    const data: any = await response.json();
    if (data.error || !data.id) {
      throw new Error(data.message || "Failed to create PayPal order.");
    }

    res.json({ orderID: data.id });
  } catch (error: any) {
    console.error("PayPal Create Order Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/payments/paypal/capture-order", async (req, res) => {
  try {
    const { orderID, userId, passStartsAt, passExpiresAt } = req.body;
    const targetUserId = userId || "kakao_77492100";

    const accessToken = await generatePayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: any = await response.json();

    if (data.status === "COMPLETED") {
      const payerID = data.payer?.payer_id || "UNKNOWN_PAYER";
      
      const result = await activate10DayLicense(
        targetUserId,
        orderID,
        payerID,
        passStartsAt,
        passExpiresAt
      );

      console.log(`💳 PayPal License Activated for User: ${targetUserId}`);
      console.log(`📅 Valid from: ${result.payment.validFrom} to: ${result.expiresAt}`);

      res.json({
        success: true,
        message: "결제가 완료되었습니다. 10일간 프리미엄 라이선스가 적용됩니다.",
        payment: result.payment,
        expiresAt: result.expiresAt
      });
    } else {
      throw new Error(`결제가 승인되지 않았습니다. 현재 상태: ${data.status}`);
    }
  } catch (error: any) {
    console.error("PayPal Capture Error:", error);
    res.status(500).json({ error: error.message || "Payment Capture Failed" });
  }
});

// ==========================================
// 4. Admin Dashboard & Operations API (/admin)
// ==========================================
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const stats = await getAdminDashboardStats();
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/alerts", async (req, res) => {
  try {
    const { adminId, titleKr, bodyKr, region, severity } = req.body;
    const alert = await createEmergencyAlert(adminId || "admin_kakao", {
      titleKr: titleKr || "도쿄 긴급 재난 공지",
      bodyKr: bodyKr || "대피소 위치를 다시 점검하세요.",
      region: region || "TOKYO",
      severity: severity || "WARNING"
    });
    res.json({ success: true, alert, message: "긴급 푸시 알림이 발송되었습니다." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 5. Server-side Gemini proxy for Emergency AI Assistant
// ==========================================
app.post("/api/disaster-assist", async (req, res) => {
  try {
    const { prompt, alertContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: "Currently operating in Offline Rule-Based Mode. Please follow standard JMA guidelines: In case of earthquake, take cover under a desk, protect your head, and proceed to the nearest offline shelter listed in the app.",
        offlineMode: true
      });
    }

    const systemInstruction = `You are KJapan AI Assistant, a specialized emergency responder for Korean travelers in Japan.
Answer questions concisely in clear Korean. Focus on immediate safety, Japanese local emergency terminology, subway/train evacuation rules, and essential Japanese emergency phrases with Korean pronunciation guidance.
Current Alert Context: ${JSON.stringify(alertContext || "Normal Safety State")}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      }
    });

    res.json({ reply: response.text, offlineMode: false });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.json({
      reply: "재난 긴급 상황 안내: 지진/쓰나미 발생 시 즉시 머리를 보호하고 고지대나 오프라인 대피소로 이동하세요.",
      error: error.message,
      offlineMode: true
    });
  }
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KJapan Server with JMA Pipeline running on http://0.0.0.0:${PORT}`);
  });
}

start();
