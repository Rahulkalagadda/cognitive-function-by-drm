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
    durationSeconds: 90
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
    durationSeconds: 80
  },
  "n-back": {
    id: "n-back",
    title: "N-Back Working Memory Task",
    domain: "Memory",
    instructions: "Letters will appear one by one. Press Spacebar (or tap match) if the current letter matches the one shown N steps ago. The N value increases with each level.",
    speakText: {
      en: "N Back Working Memory Task. Letters will appear one by one. Press the spacebar or tap the match button if the current letter matches the one shown the required number of steps ago.",
      hi: "एन बैक वर्किंग मेमोरी टेस्ट। अक्षर एक-एक करके दिखाई देंगे। यदि वर्तमान अक्षर निर्धारित कदम पहले दिखाए गए अक्षर से मेल खाता है, तो स्पेसबार दबाएं।",
      mr: "एन बॅक वर्किंग मेमरी टेस्ट. अक्षरे एकामागून एक येतील. जर सध्याचे अक्षर ठरलेल्या पायऱ्यांपूर्वी दाखवलेल्या अक्षराशी जुळत असेल तर स्पेसबार दाबा.",
      te: "ఎన్ బ్యాక్ వర్కింగ్ మెమరీ టెస్ట్. అక్షరాలు ఒక్కొక్కటిగా వస్తాయి. ప్రస్తుతం కనిపిస్తున్న అక్షరం నిర్ణీత స్థానాల క్రితం కనిపించిన అక్షరంతో సమానమైతే స్పేస్ బార్ నొక్కండి."
    },
    durationSeconds: 100
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
    durationSeconds: 150
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
    instructions: "Memorize the list of words shown. You will progress through 3 sets of increasing size. After each set, recall as many words as you can.",
    speakText: {
      en: "Word Recall Exercise. Memorize the list of words shown. You will go through three sets of increasing size. After each set, recall as many words as you can.",
      hi: "शब्द स्मरण टेस्ट। दिखाए गए शब्दों की सूची को याद रखें। आप बढ़ती सूचियों के तीन सेट से गुज़रेंगे। प्रत्येक सेट के बाद, जितने शब्द याद हों उन्हें लिखें।",
      mr: "शब्द स्मरण टेस्ट. दाखवलेले शब्द लक्षात ठेवा. तुम्ही वाढत्या सूचींच्या तीन संचांमधून जाल. प्रत्येक संचानंतर शक्य तितके शब्द आठवा.",
      te: "వర్డ్ రీకాల్ టెస్ట్. కనిపించే పదాల జాబితాను గుర్తుంచుకోండి. మీరు పెరుగుతున్న మూడు సెట్లలో వెళ్ళాలి. ప్రతి సెట్ తర్వాత మీకు గుర్తున్న పదాలన్నీ రాయండి."
    },
    durationSeconds: 120
  },
  "divided-attention": {
    id: "divided-attention",
    title: "Divided Attention Task",
    domain: "Attention",
    instructions: "This task has 5 blocks: 1. Visual tracking only. 2. Audio listening only. 3. Visual + Audio combined. 4. Visual + Audio (increased speed). 5. Visual + Audio (1-Back pattern + distractors). Check the on-screen descriptions for instructions.",
    speakText: {
      en: "Divided Attention Task. This task consists of five blocks. In block one, only track the moving dot by tapping it. In block two, only listen to the audio stream and press Respond when you hear the target number seven. In blocks three, four, and five, you will do both tasks together: track the dot and press Respond when you hear the target cue.",
      hi: "विभाजित ध्यान टेस्ट। इस टेस्ट में पांच ब्लॉक हैं। ब्लॉक 1 में, केवल ग्रिड पर बिंदु को ट्रैक करें। ब्लॉक 2 में, केवल ऑडियो सुनें और जब 7 सुनें तो Respond दबाएं। ब्लॉक 3, 4 और 5 में, आपको दोनों काम एक साथ करने होंगे।",
      mr: "विभाजित लक्ष टेस्ट. या टेस्टमध्ये पाच ब्लॉक आहेत. ब्लॉक 1 मध्ये, फक्त ग्रिडवरील बिंदू ट्रॅक करा. ब्लॉक 2 मध्ये, फक्त ऑडिओ ऐका आणि 7 ऐकल्यावर Respond दाबा. ब्लॉक 3, 4 आणि 5 मध्ये, तुम्हाला दोन्ही कामे एकत्र करावी लागतील.",
      te: "డివైడెడ్ అటెన్షన్ టెస్ట్. ఈ పరీక్షలో ఐదు బ్లాకులు ఉన్నాయి. బ్లాక్ 1 లో, గ్రిడ్‌పై చుక్కను మాత్రమే ట్రాక్ చేయండి. బ్లాక్ 2 లో, ఆడియోను మాత్రమే వినండి మరియు 7 విన్నప్పుడు Respond నొక్కండి. బ్లాక్ 3, 4 మరియు 5 లలలో, మీరు రెండు పనులను కలిసి చేయాలి."
    },
    durationSeconds: 300
  },
  "updating": {
    id: "updating",
    title: "Updating / Working Memory Task",
    domain: "Memory",
    instructions: "Watch the digit sequence carefully. At certain points you will be asked to recall the last N digits you saw, in order. The N value increases with each level.",
    speakText: {
      en: "Updating Working Memory Task. Watch the digit sequence carefully. At certain points you will be asked to recall the last digits you saw in order. The number of digits to recall increases with each level.",
      hi: "अपडेटिंग वर्किंग मेमोरी टेस्ट। अंकों की श्रृंखला को ध्यान से देखें। कुछ बिंदुओं पर आपसे अंतिम अंकों को क्रम से याद करने के लिए कहा जाएगा।",
      mr: "अपडेटिंग वर्किंग मेमरी टेस्ट. अंकांची मालिका काळजीपूर्वक पहा. काही ठिकाणी तुम्हाला शेवटचे अंक क्रमाने आठवण्यास सांगितले जाईल.",
      te: "అప్‌డేటింగ్ వర్కింగ్ మెమరీ టెస్ట్. అంకెల వరుసను జాగ్రత్తగా చూడండి. కొన్ని స్థానాల్లో మీరు చివరి అంకెలను క్రమంగా గుర్తుంచుకోవాలి."
    },
    durationSeconds: 110
  },
};

export function getTaskIdFromStep(step: AssessmentStep): TaskId {
  const domain   = step.domain;
  const taskType = step.taskType;

  // Explicit taskType overrides take priority
  if (taskType === "divided-attention") return "divided-attention";
  if (taskType === "updating")          return "updating";
  if (taskType === "word-recall")       return "word-recall";
  if (taskType === "n-back")            return "n-back";

  // Domain-based fallbacks
  if (domain === "Attention")    return "cpt";
  if (domain === "Coordination") return "go-no-go";
  if (domain === "Reasoning")    return "tower-puzzle";
  if (domain === "Perception")   return "shape-match";
  if (domain === "Memory")       return "updating";

  return "cpt"; // default fallback
}
