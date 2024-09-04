export const medicalOptions = [
  { value: "", label: "เลือกสิทธิการรักษาพยาบาล" },
  { value: "ไม่มีสิทธิการรักษาพยาบาล", label: "ไม่มีสิทธิการรักษาพยาบาล" },
  { value: "สิทธิข้าราชการ", label: "สิทธิข้าราชการ" },
  { value: "สิทธิประกันสังคม", label: "สิทธิประกันสังคม" },
  { value: "สิทธิบัตรทอง 30 บาท", label: "สิทธิบัตรทอง 30 บาท" },
  {
    value: "สิทธิบัตรประกันสุขภาพต่างด้าว",
    label: "สิทธิบัตรประกันสุขภาพต่างด้าว",
  },
  { value: "สิทธิ อ.ส.ม.", label: "สิทธิ อ.ส.ม." },
  { value: "อื่น ๆ", label: "อื่น ๆ" },
];

export const diseaseOptions = [
  { value: "", label: "เลือกการมีโรคประจำตัว" },
  { value: "ไม่มีโรคประจำตัว", label: "ไม่มีโรคประจำตัว" },
  { value: "มีโรคประจำตัว", label: "มีโรคประจำตัว" },
];

export const workOptions = [
  { value: "", label: "เลือกลักษณะสถานที่ทำงาน" },
  { value: "แยกจากที่พักอาศัย", label: "แยกจากที่พักอาศัย" },
  { value: "อยู่บริเวณที่พักอาศัย", label: "อยู่บริเวณที่พักอาศัย" },
];

export const noiseOptions = [
  { value: "", label: "เลือกตำแหน่งงาน", noise: "" },
  {
    value: "เจาะหิน",
    label: "เจาะหิน",
    noiseAvg: 95.09,
    noiseMin: 81,
    noiseMax: 102,
  },
  {
    value: "ตัดหิน/ผ่าหิน",
    label: "ตัดหิน/ผ่าหิน",
    noiseAvg: 98.26,
    noiseMin: 82,
    noiseMax: 101,
  },
  {
    value: "เจียร์/แกะสลักหิน",
    label: "เจียร์/แกะสลักหิน",
    noiseAvg: 84.39,
    noiseMin: 64,
    noiseMax: 102,
  },
  {
    value: "อื่น ๆ",
    label: "อื่น ๆ",
    noiseAvg: "",
    noiseMin: "",
    noiseMax: "",
  },
];

export const vibrationOptions = [
  {
    value: "",
    label: "",
    vibrateX: "",
    vibrateY: "",
    vibrateZ: "",
    vibrateAvg: "",
    vibrateTime: "",
    vibrateTwa: "",
  },
  {
    value: "เจาะหิน",
    label: "เจาะหิน",
    vibrateX: 5.04,
    vibrateY: 5,
    vibrateZ: 5.85,
    vibrateAvg: 9.26,
    vibrateTime: 6.89,
    vibrateTwa: 8.57,
  },
  {
    value: "ตัดหิน/ผ่าหิน",
    label: "ตัดหิน/ผ่าหิน",
    vibrateX: 5.05,
    vibrateY: 4.89,
    vibrateZ: 6.05,
    vibrateAvg: 9.32,
    vibrateTime: 6.19,
    vibrateTwa: 8.11,
  },
  {
    value: "เจียร์/แกะสลักหิน",
    label: "เจียร์/แกะสลักหิน",
    vibrateX: 5.33,
    vibrateY: 5.23,
    vibrateZ: 6.33,
    vibrateAvg: 9.84,
    vibrateTime: 6.23,
    vibrateTwa: 8.64,
  },
  {
    value: "อื่น ๆ",
    label: "อื่น ๆ",
    vibrateX: "",
    vibrateY: "",
    vibrateZ: "",
    vibrateAvg: "",
    vibrateTime: "",
    vibrateTwa: "",
  },
];

export const nationOptions = [
  { value: "", label: "เลือกสัญชาติ" },
  { value: "ไทย", label: "ไทย" },
  { value: "ลาว", label: "ลาว" },
  { value: "เมียนมาร์", label: "เมียนมาร์" },
  { value: "กัมพูชา", label: "กัมพูชา" },
  { value: "อื่น ๆ", label: "อื่น ๆ" },
];
