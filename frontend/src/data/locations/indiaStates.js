/**
 * GramMitraAI - Official Republic of India Administrative States & Union Territories (LGD)
 * Authoritative Local Government Directory (LGD) / Ministry of Panchayati Raj, Govt. of India
 * Total: 28 States + 8 Union Territories = 36 Administrative Entities
 */

export const INDIA_STATES = [
  // 28 States
  { id: 1, code: "AP", lgd_code: 28, name: "Andhra Pradesh", hindi_name: "आंध्र प्रदेश", type: "STATE" },
  { id: 2, code: "AR", lgd_code: 12, name: "Arunachal Pradesh", hindi_name: "अरुणाचल प्रदेश", type: "STATE" },
  { id: 3, code: "AS", lgd_code: 18, name: "Assam", hindi_name: "असम", type: "STATE" },
  { id: 4, code: "BR", lgd_code: 10, name: "Bihar", hindi_name: "बिहार", type: "STATE" },
  { id: 5, code: "CG", lgd_code: 22, name: "Chhattisgarh", hindi_name: "छत्तीसगढ़", type: "STATE" },
  { id: 6, code: "GA", lgd_code: 30, name: "Goa", hindi_name: "गोवा", type: "STATE" },
  { id: 7, code: "GJ", lgd_code: 24, name: "Gujarat", hindi_name: "गुजरात", type: "STATE" },
  { id: 8, code: "HR", lgd_code: 6, name: "Haryana", hindi_name: "हरियाणा", type: "STATE" },
  { id: 9, code: "HP", lgd_code: 2, name: "Himachal Pradesh", hindi_name: "हिमाचल प्रदेश", type: "STATE" },
  { id: 10, code: "JH", lgd_code: 20, name: "Jharkhand", hindi_name: "झारखंड", type: "STATE" },
  { id: 11, code: "KA", lgd_code: 29, name: "Karnataka", hindi_name: "कर्नाटक", type: "STATE" },
  { id: 12, code: "KL", lgd_code: 32, name: "Kerala", hindi_name: "केरल", type: "STATE" },
  { id: 13, code: "MP", lgd_code: 23, name: "Madhya Pradesh", hindi_name: "मध्य प्रदेश", type: "STATE" },
  { id: 14, code: "MH", lgd_code: 27, name: "Maharashtra", hindi_name: "महाराष्ट्र", type: "STATE" },
  { id: 15, code: "MN", lgd_code: 14, name: "Manipur", hindi_name: "मणिपुर", type: "STATE" },
  { id: 16, code: "ML", lgd_code: 17, name: "Meghalaya", hindi_name: "मेघालय", type: "STATE" },
  { id: 17, code: "MZ", lgd_code: 15, name: "Mizoram", hindi_name: "मिजोरम", type: "STATE" },
  { id: 18, code: "NL", lgd_code: 13, name: "Nagaland", hindi_name: "नागालैंड", type: "STATE" },
  { id: 19, code: "OD", lgd_code: 21, name: "Odisha", hindi_name: "ओडिशा", type: "STATE" },
  { id: 20, code: "PB", lgd_code: 3, name: "Punjab", hindi_name: "पंजाब", type: "STATE" },
  { id: 21, code: "RJ", lgd_code: 8, name: "Rajasthan", hindi_name: "राजस्थान", type: "STATE" },
  { id: 22, code: "SK", lgd_code: 11, name: "Sikkim", hindi_name: "सिक्किम", type: "STATE" },
  { id: 23, code: "TN", lgd_code: 33, name: "Tamil Nadu", hindi_name: "तमिलनाडु", type: "STATE" },
  { id: 24, code: "TS", lgd_code: 36, name: "Telangana", hindi_name: "तेलंगाना", type: "STATE" },
  { id: 25, code: "TR", lgd_code: 16, name: "Tripura", hindi_name: "त्रिपुरा", type: "STATE" },
  { id: 26, code: "UP", lgd_code: 9, name: "Uttar Pradesh", hindi_name: "उत्तर प्रदेश", type: "STATE" },
  { id: 27, code: "UK", lgd_code: 5, name: "Uttarakhand", hindi_name: "उत्तराखंड", type: "STATE" },
  { id: 28, code: "WB", lgd_code: 19, name: "West Bengal", hindi_name: "पश्चिम बंगाल", type: "STATE" },

  // 8 Union Territories
  { id: 29, code: "AN", lgd_code: 35, name: "Andaman and Nicobar Islands", hindi_name: "अंडमान और निकोबार द्वीप समूह", type: "UT" },
  { id: 30, code: "CH", lgd_code: 4, name: "Chandigarh", hindi_name: "चंडीगढ़", type: "UT" },
  { id: 31, code: "DD", lgd_code: 26, name: "Dadra and Nagar Haveli and Daman and Diu", hindi_name: "दादरा और नगर हवेली एवं दमन और दीव", type: "UT" },
  { id: 32, code: "DL", lgd_code: 7, name: "Delhi", hindi_name: "दिल्ली", type: "UT" },
  { id: 33, code: "JK", lgd_code: 1, name: "Jammu and Kashmir", hindi_name: "जम्मू और कश्मीर", type: "UT" },
  { id: 34, code: "LA", lgd_code: 37, name: "Ladakh", hindi_name: "लद्दाख", type: "UT" },
  { id: 35, code: "LD", lgd_code: 31, name: "Lakshadweep", hindi_name: "लक्षद्वीप", type: "UT" },
  { id: 36, code: "PY", lgd_code: 34, name: "Puducherry", hindi_name: "पुदुचेरी", type: "UT" }
];

export const getStateByCodeOrName = (identifier) => {
  if (!identifier) return null;
  const clean = identifier.toString().trim().toLowerCase();
  return INDIA_STATES.find(s => 
    s.name.toLowerCase() === clean || 
    s.code.toLowerCase() === clean || 
    s.hindi_name.toLowerCase() === clean ||
    String(s.lgd_code) === clean
  ) || null;
};
