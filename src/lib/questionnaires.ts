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
  return [
    { label: "Never", value: 0 },
    { label: "Almost Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Fairly Often", value: 3 },
    { label: "Very Often", value: 4 }
  ];
}
