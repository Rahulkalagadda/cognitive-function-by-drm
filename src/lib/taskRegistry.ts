import { TaskId } from "@/types/task.types";
import { CognitiveDomain, AssessmentStep } from "@/types/assessment.types";

export interface TaskDefinition {
  id: TaskId;
  title: string;
  domain: CognitiveDomain;
  instructions: string;
  speakText: Record<string, string>; // language -> text
  durationSeconds: number;
}

export const TASK_REGISTRY: Record<TaskId, TaskDefinition> = {
  "cpt": {
    id: "cpt",
    title: "Continuous Performance Task (CPT)",
    domain: "Attention",
    instructions: "Letters will flash on screen. Press the Spacebar (or tap the button) as fast as possible only when you see the letter 'X'. Do NOT press for any other letters.",
    speakText: {
      en: "Continuous Performance Task. Letters will flash on the screen. Press the spacebar or tap the button as fast as you can only when you see the letter X. Do not press for any other letters.",
      hi: "कंटिन्यूअस परफॉर्मेंस टेस्ट। स्क्रीन पर अक्षर फ्लैश होंगे। जब भी आप केवल 'X' अक्षर देखें, तो जितनी जल्दी हो सके स्पेसबार दबाएं या बटन दबाएं। किसी अन्य अक्षर के लिए न दबाएं।",
      mr: "कंटिन्यूअस परफॉर्मन्स टेस्ट. स्क्रीनवर अक्षरे दिसतील. जेव्हा तुम्हाला फक्त 'X' अक्षर दिसेल, तेव्हा शक्य तितक्या वेगाने स्पेसबार किंवा स्क्रीनवरील बटण दाबा. इतर अक्षरांसाठी दाबू नका.",
      te: "కంటిన్యూయస్ పెర్ఫార్మెన్స్ టెస్ట్. స్క్రీన్ పై అక్షరాలు కనిపిస్తాయి. మీరు కేవలం ఎక్స్ అక్షరాన్ని చూసినప్పుడు మాత్రమే వీలైనంత వేగంగా స్పేస్ బార్ లేదా బటన్ ను నొక్కండి. ఇతర అక్షరాలకు నొక్కవద్దు."
    },
    durationSeconds: 30
  },
  "go-no-go": {
    id: "go-no-go",
    title: "Go/No-Go Inhibition Task",
    domain: "Coordination",
    instructions: "Colored circles will flash. Press Spacebar (or tap the button) as fast as possible when a GREEN circle appears. Do NOT press when a RED circle appears.",
    speakText: {
      en: "Go No Go Task. Colored circles will flash. Press the spacebar or tap the button as fast as you can when a green circle appears. Do not press when a red circle appears.",
      hi: "गो नो गो टेस्ट। रंगीन वृत्त फ्लैश होंगे। जब हरा वृत्त दिखाई दे तो स्पेसबार दबाएं। लाल वृत्त दिखाई देने पर न दबाएं।",
      mr: "गो नो गो टेस्ट. रंगीत वर्तुळे दिसतील. जेव्हा हिरवे वर्तुळ दिसेल तेव्हा स्पेसबार दाबा. लाल वर्तुळ दिसल्यावर दाबू नका.",
      te: "గో నో గో టెస్ట్. రంగుల వృత్తాలు కనిపిస్తాయి. పచ్చటి వృత్తం కనిపించినప్పుడు స్పేస్ బార్ నొక్కండి. ఎరుపు వృత్తం కనిపించినప్పుడు నొక్కవద్దు."
    },
    durationSeconds: 30
  },
  "n-back": {
    id: "n-back",
    title: "2-Back Working Memory Task",
    domain: "Memory",
    instructions: "Letters will appear one by one. Press Spacebar (or tap match) if the current letter matches the one shown exactly 2 steps ago (e.g. A - B - A).",
    speakText: {
      en: "Two Back Working Memory Task. Letters will appear one by one. Press the spacebar or tap the match button if the current letter matches the one shown exactly two steps ago.",
      hi: "टू बैक वर्किंग मेमोरी टेस्ट। अक्षर एक-एक करके दिखाई देंगे। यदि वर्तमान अक्षर बिल्कुल दो कदम पहले दिखाए गए अक्षर से मेल खाता है, तो स्पेसबार दबाएं।",
      mr: "टू बॅक वर्किंग मेमरी टेस्ट. अक्षरे एकामागून एक येतील. जर सध्याचे अक्षर बरोबर दोन पायऱ्यांपूर्वी दाखवलेल्या अक्षराशी जुळत असेल तर स्पेसबार दाबा.",
      te: "టూ బ్యాక్ వర్కింగ్ మెమరీ టెస్ట్. అక్షరాలు ఒక్కొక్కటిగా వస్తాయి. ప్రస్తుతం కనిపిస్తున్న అక్షరం సరిగ్గా రెండు స్థానాల క్రితం కనిపించిన అక్షరంతో సమానమైతే స్పేస్ బార్ నొక్కండి."
    },
    durationSeconds: 40
  },
  "tower-puzzle": {
    id: "tower-puzzle",
    title: "Tower of London Planning Task",
    domain: "Reasoning",
    instructions: "Move the colored balls between the three pegs to match the target arrangement shown at the top. Minimize your moves.",
    speakText: {
      en: "Tower of London Planning Task. Move the colored balls between the three pegs to match the target arrangement shown at the top. Complete the puzzle in as few moves as possible.",
      hi: "टावर ऑफ लंदन प्लानिंग टेस्ट। ऊपर दिखाई गई व्यवस्था से मेल खाने के लिए तीन खूंटियों के बीच रंगीन गेंदों को स्थानांतरित करें। कम से कम चालों का उपयोग करें।",
      mr: "टॉवर ऑफ लंडन प्लॅनिंग टेस्ट. वरील लक्ष्याशी जुळण्यासाठी तीन पेग्समध्ये रंगीत चेंडू हलवा. शक्य तितक्या कमी हालचालींमध्ये पूर्ण करा.",
      te: "టవర్ ఆఫ్ లండన్ ప్లానింగ్ టెస్ట్. పైన చూపిన అమరికకు సరిపోయేలా రంగు బంతులను మూడు పెగ్స్ మధ్య జరపండి. వీలైనంత తక్కువ మూవ్స్ ఉపయోగించండి."
    },
    durationSeconds: 50
  },
  "shape-match": {
    id: "shape-match",
    title: "Shape Matching Discrimination",
    domain: "Perception",
    instructions: "Examine the sample shape in the center. Tap on the shape in the options grid below that is exactly identical to the sample shape.",
    speakText: {
      en: "Shape Matching Discrimination Task. Examine the sample shape in the center. Tap on the shape in the options grid below that is exactly identical to the sample shape.",
      hi: "आकार मिलान टेस्ट। बीच में दिए गए आकार को देखें। नीचे दिए गए विकल्पों में से बिल्कुल उसी आकार पर क्लिक करें।",
      mr: "आकार जुळणी टेस्ट. मध्यभागी असलेला नमुना आकार पहा. खालील पर्यायांमधून तंतोतंत जुळणाऱ्या आकारावर क्लिक करा.",
      te: "షేప్ మ్యాచింగ్ టెస్ట్. మధ్యలో ఉన్న ఆకారాన్ని గమనించండి. కింద ఉన్న ఆప్షన్స్ లో సరిగ్గా అదే ఆకారాన్ని ఎంచుకోండి."
    },
    durationSeconds: 25
  },
  "word-recall": {
    id: "word-recall",
    title: "Word Recall Exercise",
    domain: "Memory",
    instructions: "Memorize the list of words shown. You will have 15 seconds to review, and later you will write down as many as you can remember.",
    speakText: {
      en: "Word Recall Exercise. Memorize the list of words shown. You will have fifteen seconds to review them, and later you will write down as many as you can recall.",
      hi: "शब्द स्मरण टेस्ट। दिखाए गए शब्दों की सूची को याद रखें। आपके पास उन्हें देखने के लिए 15 सेकंड का समय होगा, और बाद में आपको याद रहे शब्दों को लिखना होगा।",
      mr: "शब्द स्मरण टेस्ट. दाखवलेले शब्द लक्षात ठेवा. शब्द पाहण्यासाठी तुमच्याकडे १५ सेकंद असतील, त्यानंतर तुम्हाला आठवणारे शब्द लिहावे लागतील.",
      te: "వర్డ్ రీకాల్ టెస్ట్. కనిపించే పదాల జాబितాను గుర్తుంచుకోండి. చదవడానికి మీకు 15 సెకన్ల సమయం ఉంటుంది, తర్వాత మీకు గుర్తున్న పదాలను రాయాలి."
    },
    durationSeconds: 30
  }
};

export function getTaskIdFromStep(step: AssessmentStep): TaskId {
  const domain = step.domain;
  const taskType = step.taskType;

  if (domain === "Attention") return "cpt";
  if (domain === "Coordination") return "go-no-go";
  if (domain === "Reasoning") return "tower-puzzle";
  if (domain === "Perception") return "shape-match";
  if (domain === "Memory") {
    return taskType === "word-recall" ? "word-recall" : "n-back";
  }
  return "cpt"; // default fallback
}
