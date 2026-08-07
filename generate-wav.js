import fs from 'fs';

const sampleRate = 44100;
const duration = 10.0;
const numSamples = sampleRate * duration;
const result = new Float32Array(numSamples);

let phase = 0;

for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const cycleTime = t % 0.9;
    
    let freq = 440;
    let gain = 0;
    
    if (cycleTime < 0.8) {
        if (cycleTime < 0.4) {
            freq = 440 * Math.pow(2, cycleTime / 0.4);
        } else {
            freq = 880 * Math.pow(0.5, (cycleTime - 0.4) / 0.4);
        }
        
        gain = 0.3 * Math.pow(0.01 / 0.3, cycleTime / 0.8);
        
        // Sawtooth wave generation
        phase += freq / sampleRate;
        if (phase > 1) phase -= 1;
        
        const sample = (phase * 2 - 1) * gain;
        result[i] = sample;
    } else {
        result[i] = 0;
        phase = 0;
    }
}

// Write to WAV
const numChannels = 1;
const format = 1; // PCM
const bitDepth = 16;
const byteRate = (sampleRate * numChannels * bitDepth) / 8;
const blockAlign = (numChannels * bitDepth) / 8;
const dataSize = result.length * numChannels * 2;
const bufferSize = 44 + dataSize;

const buffer = Buffer.alloc(bufferSize);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(format, 20);
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(bitDepth, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

let offset = 44;
for (let i = 0; i < result.length; i++) {
    let s = Math.max(-1, Math.min(1, result[i]));
    buffer.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7FFF, offset);
    offset += 2;
}

fs.writeFileSync('disaster_siren.wav', buffer);
console.log('WAV generated successfully!');
