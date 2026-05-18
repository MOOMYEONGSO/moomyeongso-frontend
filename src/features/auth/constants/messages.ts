export const getSignupCompleteLetter = (nickname: string) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}.${month}.${day}`;

  return `무명소의 시작, 진심을 담아 전합니다.\n 안녕하세요, ${nickname}님 무명소입니다.\n 우리는 매일 괜찮은 듯 지내지만, 혼자 끙끙 앓곤 합니다.\n가까운 사람들에게 걱정을 끼칠까 봐,\n혹은 나만 그런 것 같아 외로움을 느끼면서도.\n우리는 진정한 내려놓음과 탐색의 과정을 제공하고 싶었습니다.\n무명소는 이름 없이, 판단 없이, 안전하게 감정을 내려놓을 수 있는 곳입니다.\n우리는 당신이 집착감으로부터 해방되어 진정으로 가벼운 마음으로\n현생을 돌아갈 수 있도록 돕는 곳입니다.\n당신의 이야기를 들을 준비가 되어 있습니다.\n무명소와 함께 가벼운 마음으로 현생으로 돌아가시길 바랍니다.\n${formattedDate} 무명소 드림.`;
};
