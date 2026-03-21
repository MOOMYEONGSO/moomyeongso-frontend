import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Text from "../../../components/text/Text";
import Button from "../../../components/button/Button";
import classes from "./LandingPage.module.css";
import { PATHS } from "../../../constants/path";
import { useEnsureSession } from "../../auth/hooks/useEnsureSession";
import Paragraph from "../../../components/paragraph/Paragraph";
import TypeCard from "../components/card/TypeCard";

function LandingPage() {
  const [step, setStep] = useState(0);
  const { ensure, ensuring } = useEnsureSession(false);

  const handleClick = async () => {
    setStep(1);
    try {
      await ensure();
      setStep(2);
    } catch (e) {
      console.error("세션 확보 실패:", e);
      setStep(0);
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (step === 2) {
      timer = setTimeout(() => setStep(3), 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step]);

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
            익명의 기록을 시작합니다
          </Button>
        </div>
      )}

      {step > 0 && (
        <div className={classes.content}>
          <div className={classes.guide}>
            <div className={classes.guideText}>
              <Text variant="t2">기록의 깊이를 선택해주세요.</Text>
              <Paragraph>당신의 말은 짧아도, 길어도 좋습니다.</Paragraph>
            </div>
          </div>

          <div className={classes.textGroup}>
            <div
              className={`${classes.slot} ${
                step >= 2 ? classes["fade-in"] : classes["hidden"]
              } ${classes.center}`}
            >
              {step >= 2 ? (
                <Link
                  to={PATHS.DIARY_NEW_TYPE("today")}
                  className={classes.link}
                >
                  <TypeCard
                    title="오늘의 주제"
                    firstLine="매일 달라지는"
                    secondLine="가벼운 주제에요."
                    revealOnMount
                    revealDelay={600}
                    revealDurationMs={900}
                    revealEasing="ease-in"
                  />
                </Link>
              ) : (
                <div className={classes.placeholder} aria-hidden="true" />
              )}
            </div>

            <div
              className={`${classes.slot} ${
                step >= 3 ? classes["fade-in"] : classes["hidden"]
              } ${classes.left}`}
            >
              {step >= 3 ? (
                <Link
                  to={PATHS.DIARY_NEW_TYPE("public")}
                  className={classes.link}
                >
                  <TypeCard
                    title="무명소"
                    firstLine="누군가에게 고민거리를"
                    secondLine="털어 놓아보세요."
                    revealOnMount
                    revealDelay={400}
                    revealDurationMs={800}
                    revealEasing="ease-in"
                  />
                </Link>
              ) : (
                <div className={classes.placeholder} aria-hidden="true" />
              )}
            </div>

            <div
              className={`${classes.slot} ${
                step >= 3 ? classes["fade-in"] : classes["hidden"]
              } ${classes.right}`}
            >
              {step >= 3 ? (
                <Link
                  to={PATHS.DIARY_NEW_TYPE("mind")}
                  className={classes.link}
                >
                  <TypeCard
                    title="나만의 일기"
                    firstLine="지금 머리 속에 있는"
                    secondLine="생각을 남겨 보세요."
                    revealOnMount
                    revealDelay={800}
                    revealDurationMs={800}
                    revealEasing="ease-in"
                  />
                </Link>
              ) : (
                <div className={classes.placeholder} aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
