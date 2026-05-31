import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Text from "../../../components/text/Text";
import Button from "../../../components/button/Button";
import classes from "./LandingPage.module.css";
import { PATHS } from "../../../constants/path";
import { useEnsureSession } from "../../auth/hooks/useEnsureSession";
import Paragraph from "../../../components/paragraph/Paragraph";

function LandingPage() {
  const [step, setStep] = useState(0);
  const { ensure, ensuring } = useEnsureSession(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    setStep(1);
    try {
      const ok = await ensure();
      if (ok) navigate(PATHS.DIARY_NEW_TYPE("today"));
    } catch (e) {
      console.error("세션 확보 실패:", e);
      setStep(0);
    }
  };

  return (
    <div className={classes.landing}>
      {step === 0 && (
        <div className={classes.content}>
          <div className={classes.title}>
            <Text variant="t1">어디에도 하지 못한 말을</Text>
            <Text variant="t1">이곳 무명소에 흘려보내세요.</Text>
          </div>
          <Button
            revealOnMount
            revealDelay={400}
            onClick={handleClick}
            disabled={ensuring}
          >
            입장
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className={classes.content}>
          <div className={classes.guide}>
            <div className={classes.guideText}>
              <Text variant="t2">잠시만 기다려주세요.</Text>
              <Paragraph>오늘의 주제를 불러오고 있어요.</Paragraph>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
