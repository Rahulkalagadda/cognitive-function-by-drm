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
    "pss-10": {
      title: "PSS-10 Perceived Stress Scale",
      description: "In the last month, how often have you felt or thought about the following?",
      items: [
        { id: "q1", text: "Been upset because of something that happened unexpectedly?", options: getPssOptions("en") },
        { id: "q2", text: "Felt that you were unable to control the important things in your life?", options: getPssOptions("en") },
        { id: "q3", text: "Felt nervous and “stressed”?", options: getPssOptions("en") },
        { id: "q4", text: "Felt confident about your ability to handle your personal problems?", options: getPssOptions("en") },
        { id: "q5", text: "Felt that things were going your way?", options: getPssOptions("en") },
        { id: "q6", text: "Found that you could not cope with all the things that you had to do?", options: getPssOptions("en") },
        { id: "q7", text: "Been able to control irritations in your life?", options: getPssOptions("en") },
        { id: "q8", text: "Felt that you were on top of things?", options: getPssOptions("en") },
        { id: "q9", text: "Been angered because of things that were outside of your control?", options: getPssOptions("en") },
        { id: "q10", text: "Felt difficulties were piling up so high that you could not overcome them?", options: getPssOptions("en") }
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
    "pss-10": {
      title: "PSS-10 तनाव स्केल",
      description: "पिछले एक महीने में, आपने निम्नलिखित के बारे में कितनी बार सोचा या महसूस किया है?",
      items: [
        { id: "q1", text: "किसी अप्रत्याशित घटना के कारण परेशान होना?", options: getPssOptions("hi") },
        { id: "q2", text: "यह महसूस करना कि आप अपने जीवन की महत्वपूर्ण चीजों को नियंत्रित करने में असमर्थ हैं?", options: getPssOptions("hi") },
        { id: "q3", text: "घबराहट और “तनावग्रस्त” महसूस करना?", options: getPssOptions("hi") },
        { id: "q4", text: "अपनी व्यक्तिगत समस्याओं को हल करने की क्षमता पर विश्वास होना?", options: getPssOptions("hi") },
        { id: "q5", text: "यह महसूस करना कि चीजें आपके अनुसार चल रही हैं?", options: getPssOptions("hi") },
        { id: "q6", text: "यह पाना कि आप उन सभी कामों को पूरा नहीं कर पा रहे हैं जो आपको करने थे?", options: getPssOptions("hi") },
        { id: "q7", text: "अपने जीवन की चिड़चिड़ाहट को नियंत्रित करने में सक्षम होना?", options: getPssOptions("hi") },
        { id: "q8", text: "यह महसूस करना कि आप नियंत्रण में हैं?", options: getPssOptions("hi") },
        { id: "q9", text: "उन चीजों के कारण क्रोधित होना जो आपके नियंत्रण से बाहर थीं?", options: getPssOptions("hi") },
        { id: "q10", text: "यह महसूस करना कि कठिनाइयाँ इतनी बढ़ गई हैं कि आप उन्हें पार नहीं कर सकते?", options: getPssOptions("hi") }
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
    "pss-10": {
      title: "PSS-10 ताणतणाव स्केल",
      description: "गेल्या एका महिन्यात, तुम्हाला खालील गोष्टींबद्दल किती वेळा वाटले किंवा विचार आला?",
      items: [
        { id: "q1", text: "एखाद्या अनपेक्षित घटनेमुळे अस्वस्थ होणे?", options: getPssOptions("mr") },
        { id: "q2", text: "आपल्या आयुष्यातील महत्त्वाच्या गोष्टींवर आपले नियंत्रण नाही असे वाटणे?", options: getPssOptions("mr") },
        { id: "q3", text: "घाबरल्यासारखे आणि “तणावाखाली” असल्यासारखे वाटणे?", options: getPssOptions("mr") },
        { id: "q4", text: "आपल्या वैयक्तिक समस्या सोडवण्याच्या क्षमतेबद्दल आत्मविश्वास वाटणे?", options: getPssOptions("mr") },
        { id: "q5", text: "गोष्टी आपल्या मनासारख्या चालल्या आहेत असे वाटणे?", options: getPssOptions("mr") },
        { id: "q6", text: "आपल्याला करायची असलेली सर्व कामे पूर्ण करण्यास आपण असमर्थ आहोत असे आढळणे?", options: getPssOptions("mr") },
        { id: "q7", text: "आपल्या आयुष्यातील चिडचिड नियंत्रित करण्यास सक्षम असणे?", options: getPssOptions("mr") },
        { id: "q8", text: "सर्व काही आपल्या नियंत्रणात आहे असे वाटणे?", options: getPssOptions("mr") },
        { id: "q9", text: "आपल्या नियंत्रणाबाहेर असलेल्या गोष्टींमुळे राग येणे?", options: getPssOptions("mr") },
        { id: "q10", text: "अडचणी इतक्या वाढल्या आहेत की आपण त्यावर मात करू शकत नाही असे वाटणे?", options: getPssOptions("mr") }
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
    "pss-10": {
      title: "PSS-10 ఒత్తిడి స్కేల్",
      description: "గత నెలలో, మీరు క్రింది వాటిని ఎంత తరచుగా భావించారు లేదా ఆలోచించారు?",
      items: [
        { id: "q1", text: "ఊహించని సంఘటనల వల్ల కలత చెందడం?", options: getPssOptions("te") },
        { id: "q2", text: "మీ జీవితంలోని ముఖ్యమైన విషయాలను నియంత్రించలేకపోతున్నట్లు అనిపించడం?", options: getPssOptions("te") },
        { id: "q3", text: "ఆందోళనగా మరియు “ఒత్తిడిగా” అనిపించడం?", options: getPssOptions("te") },
        { id: "q4", text: "మీ వ్యక్తిగత సమస్యలను పరిష్కరించగల మీ సామర్థ్యంపై నమ్మకం ఉండటం?", options: getPssOptions("te") },
        { id: "q5", text: "విషయాలు మీ అనుకూలంగా జరుగుతున్నట్లు అనిపించడం?", options: getPssOptions("te") },
        { id: "q6", text: "మీరు చేయవలసిన పనులన్నింటినీ పూర్తి చేయలేకపోతున్నట్లు అనిపించడమా?", options: getPssOptions("te") },
        { id: "q7", text: "మీ జీవితంలోని చిరాకులను నియంత్రించగలుగుతున్నారా?", options: getPssOptions("te") },
        { id: "q8", text: "మీరు నియంత్రణలో ఉన్నట్లు అనిపించడం?", options: getPssOptions("te") },
        { id: "q9", text: "మీ నియంత్రణలో లేని విషయాల వల్ల కోపం రావడం?", options: getPssOptions("te") },
        { id: "q10", text: "ఇబ్బందులు మీ అధిగమించలేనంతగా పెరిగిపోయినట్లు అనిపించడం?", options: getPssOptions("te") }
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
