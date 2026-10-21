// 월별 시즌·이벤트 키워드. 스톡은 1~2달 앞서 올리는 경우가 많아 화면에서 월을 바꿔 뽑을 수 있어요.
// (2단계에서 웹 자동 수집으로 대체할 자리)
export const MONTH_KEYWORDS = {
  1: [
    { ko: "새해·설날", en: "new year and korean lunar new year" },
    { ko: "신년 계획·다이어리", en: "new year resolutions and planner" },
    { ko: "세뱃돈·복주머니", en: "new year lucky pouch and red envelope" },
    { ko: "붕어빵·호빵", en: "winter street snacks, fish-shaped bread and steamed buns" },
    { ko: "눈사람·눈썰매", en: "snowman and sledding" },
    { ko: "한복·세배", en: "hanbok and traditional new year bow" },
    { ko: "방학", en: "winter school vacation, kids at home" },
  ],
  2: [
    { ko: "발렌타인데이", en: "valentine's day chocolate and gifts" },
    { ko: "졸업식", en: "graduation day" },
    { ko: "입춘·봄맞이", en: "early spring awakening" },
    { ko: "초콜릿 만들기", en: "homemade chocolate making" },
    { ko: "정월대보름", en: "korean first full moon festival, nuts and rice" },
    { ko: "새학기 준비", en: "back to school supplies" },
    { ko: "겨울 끝자락 카페", en: "late winter cozy cafe" },
  ],
  3: [
    { ko: "벚꽃·봄", en: "cherry blossom spring" },
    { ko: "입학식·새학기", en: "entrance ceremony and new school year" },
    { ko: "화이트데이", en: "white day candy gifts" },
    { ko: "삼일절·태극기", en: "korean independence movement day and flag" },
    { ko: "새싹·꽃샘추위", en: "sprouts and late cold spell" },
    { ko: "이사·새출발", en: "moving house and fresh start" },
    { ko: "봄맞이 대청소", en: "spring cleaning" },
  ],
  4: [
    { ko: "벚꽃 피크닉", en: "cherry blossom picnic" },
    { ko: "식목일", en: "arbor day tree planting" },
    { ko: "중간고사", en: "midterm exams studying" },
    { ko: "봄나들이", en: "spring outing" },
    { ko: "딸기·봄과일", en: "strawberry and spring fruits" },
    { ko: "부활절", en: "easter eggs and bunny" },
    { ko: "봄 캠핑", en: "spring camping" },
  ],
  5: [
    { ko: "가정의 달", en: "family month" },
    { ko: "어린이날", en: "children's day" },
    { ko: "어버이날·카네이션", en: "parents' day carnation" },
    { ko: "스승의 날", en: "teachers' day" },
    { ko: "장미·꽃다발", en: "roses and bouquet" },
    { ko: "초여름 피크닉", en: "early summer picnic" },
    { ko: "캠핑", en: "camping" },
    { ko: "휴가", en: "holiday trip, long weekend travel" },
  ],
  6: [
    { ko: "장마·우산", en: "rainy season umbrella and raincoat" },
    { ko: "여름 시작", en: "start of summer" },
    { ko: "수박·여름과일", en: "watermelon and summer fruits" },
    { ko: "아이스크림", en: "ice cream" },
    { ko: "기말고사", en: "final exams" },
    { ko: "해수욕장 준비", en: "getting ready for the beach" },
    { ko: "호국보훈의 달", en: "korean memorial month" },
  ],
  7: [
    { ko: "휴가", en: "summer vacation trip" },
    { ko: "물놀이", en: "water play and pool" },
    { ko: "빙수", en: "shaved ice dessert" },
    { ko: "선풍기·에어컨", en: "fan and air conditioner" },
    { ko: "복날 삼계탕", en: "korean boknal samgyetang" },
    { ko: "방학", en: "summer school vacation, kids at home" },
    { ko: "해변·바캉스", en: "beach vacation" },
  ],
  8: [
    { ko: "광복절", en: "korean liberation day" },
    { ko: "바캉스·수영장", en: "vacation swimming pool" },
    { ko: "열대야", en: "tropical night heat" },
    { ko: "불꽃놀이·여름 축제", en: "fireworks and summer festival" },
    { ko: "개학 준비", en: "back to school preparation" },
    { ko: "태풍·소나기", en: "typhoon and sudden shower" },
    { ko: "가을 맞이", en: "welcoming early autumn" },
    { ko: "휴가", en: "summer holiday trip" },
    { ko: "방학", en: "last days of summer school vacation" },
  ],
  9: [
    { ko: "추석·한가위", en: "korean chuseok harvest festival" },
    { ko: "송편·명절 음식", en: "songpyeon and holiday food" },
    { ko: "가을 시작", en: "start of autumn" },
    { ko: "독서의 계절", en: "reading season" },
    { ko: "개강·새학기", en: "new semester" },
    { ko: "운동회", en: "school sports day" },
    { ko: "단풍 시작", en: "first autumn leaves" },
  ],
  10: [
    { ko: "가을 단풍", en: "autumn maple leaves" },
    { ko: "할로윈", en: "halloween" },
    { ko: "군고구마·밤", en: "roasted sweet potato and chestnuts" },
    { ko: "한글날", en: "hangul day" },
    { ko: "가을 소풍", en: "autumn picnic" },
    { ko: "감성 카페", en: "cozy autumn cafe" },
    { ko: "추수·수확", en: "autumn harvest" },
  ],
  11: [
    { ko: "수능·시험", en: "college entrance exam season" },
    { ko: "빼빼로데이", en: "pepero day" },
    { ko: "김장", en: "kimchi making day" },
    { ko: "늦가을 낙엽", en: "late autumn fallen leaves" },
    { ko: "첫눈", en: "first snow" },
    { ko: "블랙프라이데이", en: "black friday shopping" },
    { ko: "겨울 준비·방한", en: "getting ready for winter, warm clothes" },
  ],
  12: [
    { ko: "크리스마스", en: "christmas" },
    { ko: "연말 파티·송년회", en: "year-end party" },
    { ko: "연말 선물", en: "year-end gifts" },
    { ko: "눈 내리는 겨울", en: "snowy winter" },
    { ko: "동지·팥죽", en: "winter solstice red bean porridge" },
    { ko: "새해 준비", en: "getting ready for the new year" },
    { ko: "겨울 카페", en: "cozy winter cafe" },
    { ko: "방학", en: "winter school vacation, kids at home" },
    { ko: "휴가", en: "year-end holiday trip" },
  ],
};

// 중복 없이 n개를 무작위로 뽑습니다.
export function pickRandom(list, n = 3) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}
