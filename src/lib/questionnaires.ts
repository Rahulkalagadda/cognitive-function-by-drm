import { Questionnaire } from "@/types/questionnaire.types";

export const CLINICAL_QUESTIONNAIRES: Record<string, Record<string, Omit<Questionnaire, "slug">>> = {
  en: {
    "phq-9": {
      title: "PHQ-9 Depression Screening",
      description: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
      items: [
        { id: "q1", text: "Little interest or pleasure in doing things", options: getPhqOptions("en") },
        { id: "q2", text: "Feeling down, depressed, or hopeless", options: getPhqOptions("en") },
        { id: "q3", text: "Trouble falling or staying asleep, or sleeping too much", options: getPhqOptions("en") },
        { id: "q4", text: "Feeling tired or having little energy", options: getPhqOptions("en") },
        { id: "q5", text: "Poor appetite or overeating", options: getPhqOptions("en") },
        { id: "q6", text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down", options: getPhqOptions("en") },
        { id: "q7", text: "Trouble concentrating on things, such as reading the newspaper or watching television", options: getPhqOptions("en") },
        { id: "q8", text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual", options: getPhqOptions("en") },
        { id: "q9", text: "Thoughts that you would be better off dead or of hurting yourself in some way", options: getPhqOptions("en") }
      ]
    },
    "gad-7": {
      title: "GAD-7 Anxiety Screening",
      description: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
      items: [
        { id: "q1", text: "Feeling nervous, anxious, or on edge", options: getPhqOptions("en") },
        { id: "q2", text: "Not being able to stop or control worrying", options: getPhqOptions("en") },
        { id: "q3", text: "Worrying too much about different things", options: getPhqOptions("en") },
        { id: "q4", text: "Trouble relaxing", options: getPhqOptions("en") },
        { id: "q5", text: "Being so restless that it is hard to sit still", options: getPhqOptions("en") },
        { id: "q6", text: "Becoming easily annoyed or irritable", options: getPhqOptions("en") },
        { id: "q7", text: "Feeling afraid as if something awful might happen", options: getPhqOptions("en") }
      ]
    },
    "araq": {
      title: "ADHD-Related Avoidance & Anxiety Questionnaire",
      description: "Rate how often each statement has been true for you over the past 6 months.",
      items: [
        { id: "q1", text: "I know what I need to do, but struggle to get started.", options: getAraqOptions("en") },
        { id: "q2", text: "I underestimate how long tasks will take.", options: getAraqOptions("en") },
        { id: "q3", text: "I get distracted soon after beginning a task.", options: getAraqOptions("en") },
        { id: "q4", text: "I postpone tasks even when they are important.", options: getAraqOptions("en") },
        { id: "q5", text: "I have difficulty organizing steps required to complete a task.", options: getAraqOptions("en") },
        { id: "q6", text: "I forget tasks unless reminded.", options: getAraqOptions("en") },
        { id: "q7", text: "I move between multiple tasks without finishing them.", options: getAraqOptions("en") },
        { id: "q8", text: "Deadlines help me perform because I need urgency to get started.", options: getAraqOptions("en") },
        { id: "q9", text: "Before starting a task, I feel nervous or tense.", options: getAraqOptions("en") },
        { id: "q10", text: "I spend a lot of time worrying about upcoming responsibilities.", options: getAraqOptions("en") },
        { id: "q11", text: "I imagine things going wrong before I begin.", options: getAraqOptions("en") },
        { id: "q12", text: "Thinking about a task makes me feel overwhelmed.", options: getAraqOptions("en") },
        { id: "q13", text: "I avoid checking messages, emails, or work because I feel anxious about them.", options: getAraqOptions("en") },
        { id: "q14", text: "Once I actually start a task, my anxiety often decreases.", options: getAraqOptions("en") },
        { id: "q15", text: "I delay tasks because I am afraid I may not do them well enough.", options: getAraqOptions("en") },
        { id: "q16", text: "I avoid situations where my performance may be judged.", options: getAraqOptions("en") },
        { id: "q17", text: "I feel that mistakes reflect poorly on me as a person.", options: getAraqOptions("en") },
        { id: "q18", text: "I spend excessive time preparing before starting.", options: getAraqOptions("en") },
        { id: "q19", text: "I fear disappointing others if I perform poorly.", options: getAraqOptions("en") },
        { id: "q20", text: "I avoid tasks when success is uncertain.", options: getAraqOptions("en") },
        { id: "q21", text: "I would rather not try than risk failing.", options: getAraqOptions("en") },
        { id: "q22", text: "I often wait for the perfect time to begin.", options: getAraqOptions("en") },
        { id: "q23", text: "My procrastination affects my work or studies.", options: getAraqOptions("en") },
        { id: "q24", text: "My procrastination creates stress in my relationships.", options: getAraqOptions("en") },
        { id: "q25", text: "Important opportunities have been missed because of delay or avoidance.", options: getAraqOptions("en") },
        { id: "q26", text: "I feel frustrated by my inability to start or complete tasks.", options: getAraqOptions("en") }
      ]
    }
  },
  hi: {
    "phq-9": {
      title: "PHQ-9 अवसाद स्क्रीनिंग",
      description: "पिछले 2 हफ्तों में, आप निम्नलिखित में से किसी भी समस्या से कितनी बार परेशान रहे हैं?",
      items: [
        { id: "q1", text: "काम करने में कम रुचि या आनंद होना", options: getPhqOptions("hi") },
        { id: "q2", text: "उदास, निराश या लाचार महसूस करना", options: getPhqOptions("hi") },
        { id: "q3", text: "सोने में परेशानी या बहुत अधिक सोना", options: getPhqOptions("hi") },
        { id: "q4", text: "थकान या कम ऊर्जा महसूस करना", options: getPhqOptions("hi") },
        { id: "q5", text: "कम भूख लगना या बहुत अधिक खाना", options: getPhqOptions("hi") },
        { id: "q6", text: "अपने बारे में बुरा महसूस करना — या कि आप एक असफल व्यक्ति हैं या आपने अपने परिवार को नीचा दिखाया है", options: getPhqOptions("hi") },
        { id: "q7", text: "चीजों पर ध्यान केंद्रित करने में परेशानी, जैसे समाचार पत्र पढ़ना या टीवी देखना", options: getPhqOptions("hi") },
        { id: "q8", text: "इतनी धीमी गति से चलना या बोलना कि अन्य लोग ध्यान दे सकें? या इसके विपरीत — अत्यधिक बेचैनी महसूस करना", options: getPhqOptions("hi") },
        { id: "q9", text: "यह विचार आना कि मर जाना बेहतर होगा या स्वयं को नुकसान पहुँचाने का प्रयास करना", options: getPhqOptions("hi") }
      ]
    },
    "gad-7": {
      title: "GAD-7 चिंता स्क्रीनिंग",
      description: "पिछले 2 हफ्तों में, आप निम्नलिखित में से किसी भी समस्या से कितनी बार परेशान रहे हैं?",
      items: [
        { id: "q1", text: "घबराहट, चिंता या तनाव महसूस करना", options: getPhqOptions("hi") },
        { id: "q2", text: "चिंता करना बंद करने या नियंत्रित करने में असमर्थ होना", options: getPhqOptions("hi") },
        { id: "q3", text: "विभिन्न चीजों के बारे में बहुत अधिक चिंता करना", options: getPhqOptions("hi") },
        { id: "q4", text: "आराम करने में परेशानी", options: getPhqOptions("hi") },
        { id: "q5", text: "इतनी बेचैनी होना कि एक जगह शांत बैठना मुश्किल हो", options: getPhqOptions("hi") },
        { id: "q6", text: "आसानी से चिढ़ जाना या क्रोधित हो जाना", options: getPhqOptions("hi") },
        { id: "q7", text: "ऐसा डर महसूस होना जैसे कुछ बुरा होने वाला है", options: getPhqOptions("hi") }
      ]
    },
    "araq": {
      title: "ADHD-Related Avoidance & Anxiety Questionnaire",
      description: "Rate how often each statement has been true for you over the past 6 months.",
      items: [
        { id: "q1", text: "मुझे पता है कि मुझे क्या करना है, लेकिन शुरू करने में कठिनाई होती है।", options: getAraqOptions("hi") },
        { id: "q2", text: "मैं कम आंकता हूँ कि किसी काम में कितना समय लगेगा।", options: getAraqOptions("hi") },
        { id: "q3", text: "काम शुरू करने के तुरंत बाद मेरा ध्यान भटक जाता है।", options: getAraqOptions("hi") },
        { id: "q4", text: "मैं महत्वपूर्ण होने पर भी कामों को टाल देता हूँ।", options: getAraqOptions("hi") },
        { id: "q5", text: "मुझे किसी काम को पूरा करने के लिए आवश्यक कदमों को व्यवस्थित करने में कठिनाई होती है।", options: getAraqOptions("hi") },
        { id: "q6", text: "जब तक मुझे याद न दिलाया जाए, मैं काम भूल जाता हूँ।", options: getAraqOptions("hi") },
        { id: "q7", text: "मैं किसी काम को पूरा किए बिना कई कामों के बीच बदलता रहता हूँ।", options: getAraqOptions("hi") },
        { id: "q8", text: "समय-सीमा (डेडलाइन) मुझे काम करने में मदद करती है क्योंकि मुझे शुरू करने के लिए तात्कालिकता की आवश्यकता होती है।", options: getAraqOptions("hi") },
        { id: "q9", text: "कोई काम शुरू करने से पहले, मैं घबराहट या तनाव महसूस करता हूँ।", options: getAraqOptions("hi") },
        { id: "q10", text: "मैं आने वाली जिम्मेदारियों के बारे में चिंता करने में बहुत समय बिताता हूँ।", options: getAraqOptions("hi") },
        { id: "q11", text: "शुरू करने से पहले मैं कल्पना करता हूँ कि चीजें खराब हो जाएंगी।", options: getAraqOptions("hi") },
        { id: "q12", text: "किसी काम के बारे में सोचने से ही मैं अभिभूत (overwhelmed) महसूस करने लगता हूँ।", options: getAraqOptions("hi") },
        { id: "q13", text: "मैं संदेशों, ईमेल या काम की जाँच करने से बचता हूँ क्योंकि मैं उनके बारे में चिंतित महसूस करता हूँ।", options: getAraqOptions("hi") },
        { id: "q14", text: "एक बार जब मैं वास्तव में काम शुरू कर देता हूँ, तो मेरी चिंता अक्सर कम हो जाती है।", options: getAraqOptions("hi") },
        { id: "q15", text: "मैं कामों में देरी करता हूँ क्योंकि मुझे डर है कि मैं उन्हें पर्याप्त रूप से अच्छे से नहीं कर पाऊंगा।", options: getAraqOptions("hi") },
        { id: "q16", text: "मैं उन स्थितियों से बचता हूँ जहाँ मेरे प्रदर्शन का आकलन (जज) किया जा सकता है।", options: getAraqOptions("hi") },
        { id: "q17", text: "मुझे लगता है कि गलतियाँ एक व्यक्ति के रूप में मेरी छवि को खराब करती हैं।", options: getAraqOptions("hi") },
        { id: "q18", text: "मैं शुरू करने से पहले तैयारी करने में अत्यधिक समय बिताता हूँ।", options: getAraqOptions("hi") },
        { id: "q19", text: "मुझे डर लगता है कि यदि मैं खराब प्रदर्शन करूँगा तो दूसरों को निराश करूँगा।", options: getAraqOptions("hi") },
        { id: "q20", text: "जब सफलता अनिश्चित होती है तो मैं उन कामों से बचता हूँ।", options: getAraqOptions("hi") },
        { id: "q21", text: "मैं असफल होने के जोखिम से बचने के लिए प्रयास न करना ही बेहतर समझता हूँ।", options: getAraqOptions("hi") },
        { id: "q22", text: "मैं अक्सर शुरू करने के लिए सही समय की प्रतीक्षा करता हूँ।", options: getAraqOptions("hi") },
        { id: "q23", text: "मेरी टालमटोल की आदत मेरे काम या पढ़ाई को प्रभावित करती है।", options: getAraqOptions("hi") },
        { id: "q24", text: "मेरी टालमटोल की आदत मेरे रिश्तों में तनाव पैदा करती है।", options: getAraqOptions("hi") },
        { id: "q25", text: "देरी या काम टालने के कारण महत्वपूर्ण अवसर छूट गए हैं।", options: getAraqOptions("hi") },
        { id: "q26", text: "काम शुरू करने या पूरा करने में अपनी असमर्थता के कारण मैं निराश महसूस करता हूँ।", options: getAraqOptions("hi") }
      ]
    }
  },
  mr: {
    "phq-9": {
      title: "PHQ-9 नैराश्य स्क्रीनिंग",
      description: "गेल्या २ आठवड्यांत, तुम्हाला खालीलपैकी कोणत्याही समस्येचा किती वेळा त्रास झाला आहे?",
      items: [
        { id: "q1", text: "गोष्टी करण्यात कमी रस किंवा आनंद मिळणे", options: getPhqOptions("mr") },
        { id: "q2", text: "निराश, उदास किंवा हताश वाटणे", options: getPhqOptions("mr") },
        { id: "q3", text: "झोपायला त्रास होणे किंवा जास्त झोप येणे", options: getPhqOptions("mr") },
        { id: "q4", text: "थकवा किंवा कमी ऊर्जा जाणवणे", options: getPhqOptions("mr") },
        { id: "q5", text: "भूक न लागणे किंवा जास्त खाणे", options: getPhqOptions("mr") },
        { id: "q6", text: "स्वतःबद्दल वाईट वाटणे — किंवा आपण अयशस्वी झालो आहोत किंवा कुटुंबाची निराशा केली आहे असे वाटणे", options: getPhqOptions("mr") },
        { id: "q7", text: "गोष्टींवर लक्ष केंद्रित करण्यात अडचण येणे, जसे की वर्तमानपत्र वाचणे किंवा टीव्ही पाहणे", options: getPhqOptions("mr") },
        { id: "q8", text: "इतक्या हळूहळू चालणे किंवा बोलणे की इतर लोकांच्या ते लक्षात येईल? किंवा याउलट — अत्यंत अस्वस्थ वाटणे", options: getPhqOptions("mr") },
        { id: "q9", text: "आपण मरून गेलो तर बरे होईल किंवा स्वतःला दुखापत करून घेण्याचे विचार येणे", options: getPhqOptions("mr") }
      ]
    },
    "gad-7": {
      title: "GAD-7 चिंता स्क्रीनिंग",
      description: "गेल्या २ आठवड्यांत, तुम्हाला खालीलपैकी कोणत्याही समस्येचा किती वेळा त्रास झाला आहे?",
      items: [
        { id: "q1", text: "अस्वस्थ, चिंतेत किंवा तणावाखाली वाटणे", options: getPhqOptions("mr") },
        { id: "q2", text: "चिंता थांबवणे किंवा नियंत्रित करणे शक्य न होणे", options: getPhqOptions("mr") },
        { id: "q3", text: "वेगवेगळ्या गोष्टींबद्दल खूप जास्त चिंता करणे", options: getPhqOptions("mr") },
        { id: "q4", text: "आराम करण्यास त्रास होणे", options: getPhqOptions("mr") },
        { id: "q5", text: "एवढी अस्वस्थता असणे की एका ठिकाणी शांत बसणे कठीण जाणे", options: getPhqOptions("mr") },
        { id: "q6", text: "सहज चिडचिड किंवा संताप होणे", options: getPhqOptions("mr") },
        { id: "q7", text: "काहीतरी वाईट घडणार आहे अशी भीती वाटणे", options: getPhqOptions("mr") }
      ]
    },
    "araq": {
      title: "ADHD-Related Avoidance & Anxiety Questionnaire",
      description: "Rate how often each statement has been true for you over the past 6 months.",
      items: [
        { id: "q1", text: "मला माहीत आहे की मला काय करायचे आहे, पण सुरू करायला त्रास होतो.", options: getAraqOptions("mr") },
        { id: "q2", text: "काम पूर्ण व्हायला किती वेळ लागेल याचा मी कमी अंदाज लावतो.", options: getAraqOptions("mr") },
        { id: "q3", text: "काम सुरू केल्यावर लगेचच माझे लक्ष विचलित होते.", options: getAraqOptions("mr") },
        { id: "q4", text: "कामे महत्त्वाची असली तरी मी ती पुढे ढकलतो.", options: getAraqOptions("mr") },
        { id: "q5", text: "काम पूर्ण करण्यासाठी आवश्यक पायऱ्या व्यवस्थित मांडण्यात मला अडचण येते.", options: getAraqOptions("mr") },
        { id: "q6", text: "आठवण करून दिल्याशिवाय मी कामे विसरतो.", options: getAraqOptions("mr") },
        { id: "q7", text: "मी कामे पूर्ण न करता एकाच वेळी अनेक कामे करत राहतो.", options: getAraqOptions("mr") },
        { id: "q8", text: "अंतिम मुदत (डेडलाइन) मला काम करायला मदत करते कारण सुरू करण्यासाठी मला घाईची गरज असते.", options: getAraqOptions("mr") },
        { id: "q9", text: "काम सुरू करण्यापूर्वी मला अस्वस्थ किंवा ताण जाणवतो.", options: getAraqOptions("mr") },
        { id: "q10", text: "मी येणाऱ्या जबाबदाऱ्यांविषयी चिंता करण्यात खूप वेळ घालवतो.", options: getAraqOptions("mr") },
        { id: "q11", text: "काम सुरू करण्यापूर्वीच काहीतरी वाईट घडेल अशी मी कल्पना करतो.", options: getAraqOptions("mr") },
        { id: "q12", text: "कामाचा विचार केल्यानेच मला खूप ताण येतो.", options: getAraqOptions("mr") },
        { id: "q13", text: "मला काळजी वाटत असल्यामुळे मी मेसेज, ईमेल किंवा काम तपासणे टाळतो.", options: getAraqOptions("mr") },
        { id: "q14", text: "एकदा का मी प्रत्यक्ष काम सुरू केले की, माझी चिंता बऱ्याचदा कमी होते.", options: getAraqOptions("mr") },
        { id: "q15", text: "मी कामे पुढे ढकलतो कारण मला भीती वाटते की मी ते पुरेसे चांगले करू शकणार नाही.", options: getAraqOptions("mr") },
        { id: "q16", text: "ज्या ठिकाणी माझ्या कामाचे मूल्यमापन केले जाऊ शकते अशा परिस्थिती मी टाळतो.", options: getAraqOptions("mr") },
        { id: "q17", text: "मला वाटते की चुकांमुळे एक व्यक्ती म्हणून माझी प्रतिमा खराब होते.", options: getAraqOptions("mr") },
        { id: "q18", text: "सुरू करण्यापूर्वी मी तयारी करण्यात जास्त वेळ घालवतो.", options: getAraqOptions("mr") },
        { id: "q19", text: "मी वाईट कामगिरी केल्यास इतरांचा हिरमोड होईल अशी मला भीती वाटते.", options: getAraqOptions("mr") },
        { id: "q20", text: "यश अनिश्चित असते तेव्हा मी ती कामे करणे टाळतो.", options: getAraqOptions("mr") },
        { id: "q21", text: "अपयशाची जोखीम पत्करण्यापेक्षा मी प्रयत्नच न करणे पसंत करेन.", options: getAraqOptions("mr") },
        { id: "q22", text: "मी अनेकदा सुरू करण्यासाठी योग्य वेळेची वाट पाहत राहतो.", options: getAraqOptions("mr") },
        { id: "q23", text: "माझी काम टाळण्याची सवय माझ्या कामावर किंवा अभ्यासावर परिणाम करते.", options: getAraqOptions("mr") },
        { id: "q24", text: "माझी काम टाळण्याची सवय माझ्या नातेसंबंधांमध्ये ताण निर्माण करते.", options: getAraqOptions("mr") },
        { id: "q25", text: "उशीर किंवा टाळाटाळ केल्यामुळे महत्त्वाच्या संधी हुकल्या आहेत.", options: getAraqOptions("mr") },
        { id: "q26", text: "काम सुरू किंवा पूर्ण करू न शकल्यामुळे मला हताश वाटते.", options: getAraqOptions("mr") }
      ]
    }
  },
  te: {
    "phq-9": {
      title: "PHQ-9 డిప్రెషన్ స్క్రీనింగ్",
      description: "గత 2 వారాలుగా, మీరు ఈ క్రింది సమస్యలలో దేనినైనా ఎంత తరచుగా ఎదుర్కొంటున్నారు?",
      items: [
        { id: "q1", text: "పనులపై ఆసక్తి లేదా ఆనందం లేకపోవడం", options: getPhqOptions("te") },
        { id: "q2", text: "నిరాశ, విచారం లేదా నిస్సహాయత భావన", options: getPhqOptions("te") },
        { id: "q3", text: "నిద్రపోవడంలో ఇబ్బంది లేదా అతిగా నిద్రపోవడం", options: getPhqOptions("te") },
        { id: "q4", text: "అలసట లేదా తక్కువ శక్తి ఉన్నట్లు అనిపించడం", options: getPhqOptions("te") },
        { id: "q5", text: "ఆకలి లేకపోవడం లేదా అతిగా తినడం", options: getPhqOptions("te") },
        { id: "q6", text: "మీ గురించి మీరే తక్కువగా భావించడం — లేదా మీరు విఫలమయ్యారని లేదా మీ కుటుంబానికి అవమానం తెచ్చారని అనిపించడం", options: getPhqOptions("te") },
        { id: "q7", text: "విషయాలపై దృష్టి పెట్టడం కష్టంగా ఉండటం, వార్తాపత్రిక చదవడం లేదా టీవీ చూడటం వంటివి", options: getPhqOptions("te") },
        { id: "q8", text: "ఇతరులు గమనించేంత నెమ్మదిగా నడవడం లేదా మాట్లాడటం? లేదా దీనికి విరుద్ధంగా — చాలా అశాంతిగా ఉండటం", options: getPhqOptions("te") },
        { id: "q9", text: "చనిపోతే బాగుండునని అనిపించడం లేదా మీకు మీరే హాని చేసుకోవాలనే ఆలోచనలు రావడం", options: getPhqOptions("te") }
      ]
    },
    "gad-7": {
      title: "GAD-7 ఆందోళన స్క్రీనింగ్",
      description: "గత 2 వారాలుగా, మీరు ఈ క్రింది సమస్యలలో దేనినైనా ఎంత తరచుగా ఎదుర్కొంటున్నారు?",
      items: [
        { id: "q1", text: "ఆందోళన, భయం లేదా ఉద్రిక్తత అనుభూతి", options: getPhqOptions("te") },
        { id: "q2", text: "చింతించడాన్ని ఆపలేకపోవడం లేదా నియంత్రించలేకపోవడం", options: getPhqOptions("te") },
        { id: "q3", text: "వివిధ విషయాల గురించి అతిగా చింతించడం", options: getPhqOptions("te") },
        { id: "q4", text: "ప్రశాంతంగా ఉండలేకపోవడం", options: getPhqOptions("te") },
        { id: "q5", text: "ఒకచోట స్థిరంగా కూర్చోలేనంత అశాంతిగా ఉండటం", options: getPhqOptions("te") },
        { id: "q6", text: "సులభంగా చిరాకు పడటం లేదా కోపం రావడం", options: getPhqOptions("te") },
        { id: "q7", text: "ఏదో చెడు జరగబోతుందనే భయం కలగడం", options: getPhqOptions("te") }
      ]
    },
    "araq": {
      title: "ADHD-Related Avoidance & Anxiety Questionnaire",
      description: "Rate how often each statement has been true for you over the past 6 months.",
      items: [
        { id: "q1", text: "నేను ఏమి చేయాలో నాకు తెలుసు, కానీ ప్రారంభించడానికి ఇబ్బంది పడతాను.", options: getAraqOptions("te") },
        { id: "q2", text: "పనులు పూర్తి కావడానికి ఎంత సమయం పడుతుందో నేను తక్కువ అంచనా వేస్తాను.", options: getAraqOptions("te") },
        { id: "q3", text: "పని ప్రారంభించిన వెంటనే నా దృష్టి మళ్ళుతుంది.", options: getAraqOptions("te") },
        { id: "q4", text: "పనులు ముఖ్యమైనవైనా నేను వాటిని వాయిదా వేస్తాను.", options: getAraqOptions("te") },
        { id: "q5", text: "పని పూర్తి చేయడానికి అవసరమైన దశలను నిర్వహించడంలో నాకు ఇబ్బందిగా ఉంటుంది.", options: getAraqOptions("te") },
        { id: "q6", text: "ఎవరైనా గుర్తు చేస్తేనే కానీ నేను పనులను మర్చిపోతాను.", options: getAraqOptions("te") },
        { id: "q7", text: "నేను పూర్తి చేయకుండానే ఒక పని నుండి మరో పనికి మారిపోతాను.", options: getAraqOptions("te") },
        { id: "q8", text: "గడువు తేదీలు నన్ను పని చేసేలా చేస్తాయి ఎందుకంటే ప్రారంభించడానికి నాకు అత్యవసరం కావాలి.", options: getAraqOptions("te") },
        { id: "q9", text: "పని ప్రారంభించే ముందు, నాకు ఆందోళనగా లేదా ఒత్తిడిగా అనిపిస్తుంది.", options: getAraqOptions("te") },
        { id: "q10", text: "రాబోయే బాధ్యతల గురించి నేను చాలా సమయం ఆందోళన చెందుతాను.", options: getAraqOptions("te") },
        { id: "q11", text: "ప్రారంభించే ముందే పనులు పాడైపోతాయని నేను ఊहించుకుంటాను.", options: getAraqOptions("te") },
        { id: "q12", text: "పని గురించి ఆలోచించడం నన్ను బెంబేలెత్తిస్తుంది.", options: getAraqOptions("te") },
        { id: "q13", text: "నేను మెసేజ్‌లు, ఈమెయిల్‌లు లేదా పనిని తనిఖీ చేయకుండా నివారిస్తాను ఎందుकంటే వాటి గురించి నాకు ఆందోళనగా ఉంటుంది.", options: getAraqOptions("te") },
        { id: "q14", text: "నేను పని ప్రారంభించిన తర్వాత, నా ఆందోళన తరచుగా తగ్గుతుంది.", options: getAraqOptions("te") },
        { id: "q15", text: "నేను పనులను వాయిదా వేస్తాను ఎందుకంటే నేను వాటిని సరిగ్గా చేయలేనేమోనని భయపడతాను.", options: getAraqOptions("te") },
        { id: "q16", text: "నా పనితీరును అంచనా వేసే పరిస్థితులను నేను నివారిస్తాను.", options: getAraqOptions("te") },
        { id: "q17", text: "తప్పులు ఒక వ్యక్తిగా నన్ను తక్కువ చేసి చూపుతాయని నేను భావిస్తాను.", options: getAraqOptions("te") },
        { id: "q18", text: "ప్రారంభించడానికి ముందు నేను సిద్ధం కావడానికి ఎక్కువ సమయం తీసుకుంటాను.", options: getAraqOptions("te") },
        { id: "q19", text: "నా పనితీరు బాగోలేకపోతే ఇతరులను నిరాశపరుస్తానని నేను భయపడతాను.", options: getAraqOptions("te") },
        { id: "q20", text: "విజయం అస్పష్టంగా ఉన్నప్పుడు నేను ఆ పనులను నివారిస్తాను.", options: getAraqOptions("te") },
        { id: "q21", text: "విఫలమయ్యే ప్రమాదం కంటే నేను ప్రయత్నించకపోవడమే మంచిదని అనుకుంటాను.", options: getAraqOptions("te") },
        { id: "q22", text: "ప్రారంభించడానికి నేను తరచుగా సరైన సమయం కోసం వేచి ఉంటాను.", options: getAraqOptions("te") },
        { id: "q23", text: "నా వాయిదా వేసే అలవాటు నా పనిని లేదా చదువును ప్రభావితం చేస్తుంది.", options: getAraqOptions("te") },
        { id: "q24", text: "నా వాయిదా వేసే అలవాటు నా సంబంధాలలో ఒత్తిడిని కలిగిస్తుంది.", options: getAraqOptions("te") },
        { id: "q25", text: "ఆలస్యం లేదా నివారించడం వల్ల ముఖ్యమైన అవకాశాలు చేజారిపోయాయి.", options: getAraqOptions("te") },
        { id: "q26", text: "పనులను ప్రారంభించలేకపోవడం లేదా పూర్తి చేయలేకపోవడం వల్ల నేను నిరాశకు గురవుతాను.", options: getAraqOptions("te") }
      ]
    }
  }
};

function getPhqOptions(lang: string) {
  if (lang === "hi") {
    return [
      { label: "बिलकुल नहीं", value: 0 },
      { label: "कई दिन", value: 1 },
      { label: "आधे से अधिक दिन", value: 2 },
      { label: "लगभग हर दिन", value: 3 }
    ];
  }
  if (lang === "mr") {
    return [
      { label: "अजिबात नाही", value: 0 },
      { label: "काही दिवस", value: 1 },
      { label: "अर्ध्याहून अधिक दिवस", value: 2 },
      { label: "जवळजवळ दररोज", value: 3 }
    ];
  }
  if (lang === "te") {
    return [
      { label: "అస్సలు లేదు", value: 0 },
      { label: "కొన్ని రోజులు", value: 1 },
      { label: "సగానికి పైగా రోజులు", value: 2 },
      { label: "దాదాపు ప్రతి రోజు", value: 3 }
    ];
  }
  return [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 }
  ];
}

function getPssOptions(lang: string) {
  if (lang === "hi") {
    return [
      { label: "कभी नहीं", value: 0 },
      { label: "शायद ही कभी", value: 1 },
      { label: "कभी-कभी", value: 2 },
      { label: "अक्सर", value: 3 },
      { label: "हमेशा", value: 4 }
    ];
  }
  if (lang === "mr") {
    return [
      { label: "कधीच नाही", value: 0 },
      { label: "जवळजवळ कधीच नाही", value: 1 },
      { label: "कधीकधी", value: 2 },
      { label: "बऱ्याचदा", value: 3 },
      { label: "नेहमीच", value: 4 }
    ];
  }
  if (lang === "te") {
    return [
      { label: "ఎప్పుడూ లేదు", value: 0 },
      { label: "దాదాపు ఎప్పుడూ లేదు", value: 1 },
      { label: "కొన్నిసార్లు", value: 2 },
      { label: "తరచుగా", value: 3 },
      { label: "చాలా తరచుగా", value: 4 }
    ];
  }
  return [
    { label: "Never", value: 0 },
    { label: "Almost Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Fairly Often", value: 3 },
    { label: "Very Often", value: 4 }
  ];
}

export function getAraqOptions(lang: string) {
  if (lang === "hi") {
    return [
      { label: "कभी नहीं", value: 0 },
      { label: "शायद ही कभी", value: 1 },
      { label: "कभी-कभी", value: 2 },
      { label: "अक्सर", value: 3 },
      { label: "बहुत अक्सर", value: 4 }
    ];
  }
  if (lang === "mr") {
    return [
      { label: "कधीच नाही", value: 0 },
      { label: "कधीतरीच", value: 1 },
      { label: "कधीकधी", value: 2 },
      { label: "बऱ्याचदा", value: 3 },
      { label: "नेहमीच", value: 4 }
    ];
  }
  if (lang === "te") {
    return [
      { label: "ఎప్పుడూ లేదు", value: 0 },
      { label: "అరుదుగా", value: 1 },
      { label: "కొన్నిసార్లు", value: 2 },
      { label: "తరచుగా", value: 3 },
      { label: "చాలా తరచుగా", value: 4 }
    ];
  }
  return [
    { label: "Never", value: 0 },
    { label: "Rarely", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Very Often", value: 4 }
  ];
}

export function getMixedQuestionnaire(lang: string = "en") {
  const phq = CLINICAL_QUESTIONNAIRES[lang]?.["phq-9"] || CLINICAL_QUESTIONNAIRES["en"]?.["phq-9"];
  const gad = CLINICAL_QUESTIONNAIRES[lang]?.["gad-7"] || CLINICAL_QUESTIONNAIRES["en"]?.["gad-7"];
  const araq = CLINICAL_QUESTIONNAIRES[lang]?.["araq"] || CLINICAL_QUESTIONNAIRES["en"]?.["araq"];
  
  if (!phq || !gad || !araq) return null;
  
  const phqItems = phq.items.map((item) => ({ ...item, id: `phq_${item.id}`, originalId: item.id, source: "phq-9" as const }));
  const gadItems = gad.items.map((item) => ({ ...item, id: `gad_${item.id}`, originalId: item.id, source: "gad-7" as const }));
  const araqItems = araq.items.map((item) => ({ ...item, id: `araq_${item.id}`, originalId: item.id, source: "araq" as const }));
  
  const mixedItems: any[] = [];
  const maxLength = Math.max(phqItems.length, gadItems.length, araqItems.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < phqItems.length) mixedItems.push(phqItems[i]);
    if (i < gadItems.length) mixedItems.push(gadItems[i]);
    if (i < araqItems.length) mixedItems.push(araqItems[i]);
  }
  
  return {
    title: lang === "hi" ? "स्वास्थ्य प्रश्नावली" : (lang === "mr" ? "आरोग्य प्रश्नावली" : (lang === "te" ? "ఆరోగ్య ప్రశ్నావళి" : "Clinical Questionnaire")),
    description: lang === "hi" ? "कृपया अपनी स्थिति का आकलन करने के लिए निम्नलिखित प्रत्येक कथन को ध्यान से पढ़ें और उत्तर दें।" : (lang === "mr" ? "कृपया खालील प्रत्येक विधान काळजीपूर्वक वाचा आणि उत्तर द्या." : (lang === "te" ? "దయచేసి కింది ప్రతి స్టేట్‌మెంట్‌ను జాగ్రత్తగా చదివి సమాధానం ఇవ్వండి." : "Please read each statement carefully and select the response that best describes you.")),
    items: mixedItems
  };
}
