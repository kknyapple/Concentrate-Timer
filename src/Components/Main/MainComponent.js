import React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { useRecoilValue, useRecoilState } from "recoil";

import {
  stopWatchStart,
  studyTimePass,
  studyHour,
  studyMinute,
  studySecond,
  startTime,
  pauseTime,
  todayDate,
} from "../../recoil/concentrate";
import StopWatchDetailComponent from "./StopWatchDetail/StopWatchDetailComponent";
import StopWatchComponent from "./StopWatch/StopWatchComponent";
import RecordComponent from "./RecordComponent";
import MemoComponent from "./Memo/MemoComponent";

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: whitesmoke;
  font-size: 20px;
`;

const StudyTime = styled.div`
  display: flex;
  font-size: 60px;
  margin: 30px;
`;

const MainComponent = () => {
  const start = useRecoilValue(stopWatchStart);
  const pass = useRecoilValue(studyTimePass);
  //const timeoutId = useRecoilState(timeoutId);

  const [hour, setHour] = useRecoilState(studyHour);
  const [minute, setMinute] = useRecoilState(studyMinute);
  const [second, setSecond] = useRecoilState(studySecond);

  const [currentStartTime, setCurrentStartTime] = useRecoilState(startTime);
  const [currentPauseTime, setCurrentPauseTime] = useRecoilState(pauseTime);

  const [today, setToday] = useRecoilState(todayDate);

  const dateObj = new Date();
  let year = dateObj.getFullYear();
  let month = String(dateObj.getMonth() + 1).padStart(2, "0");
  let day = String(dateObj.getDate()).padStart(2, "0");

  //let today = `${year}-${month}-${day}`;

  // console.log(today);

  useEffect(() => {}, []);

  useEffect(() => {
    if (start === true && pass === true) {
      //let timerId = setTimeout(() => setSecond(second + 1), 1000);

      let timerId = setTimeout(() => {
        const now = new Date(Date.now() - currentStartTime);
        console.log(now.getUTCHours());
        console.log(now.getUTCMinutes());
        console.log(now.getUTCSeconds());

        setSecond(now.getUTCSeconds());
        setMinute(now.getUTCMinutes());
        setHour(now.getUTCHours());
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [start, pass, second]);

  useEffect(() => {
    let length = JSON.parse(localStorage.getItem("key")).length;
    let lastStudy = JSON.parse(localStorage.getItem("key"))[length - 1].day;
    let today = `${year}-${month}-${day}`;

    setToday(`${year}-${month}-${day}`);

    if (localStorage.getItem("key")) {
      if (lastStudy === today) {
        setCurrentStartTime(
          currentStartTime -
            second * 1000 -
            minute * 1000 * 60 -
            hour * 1000 * 60 * 60
        );
      } else {
        setHour(0);
        setMinute(0);
        setSecond(0);

        localStorage.setItem("hour", hour);
        localStorage.setItem("minute", minute);
        localStorage.setItem("second", second);

        setCurrentStartTime(null);
        setCurrentPauseTime(null);
      }
    }
  }, []);

  return (
    <Main>
      <StudyTime>
        {`${String(hour).padStart(2, "0")}:${String(minute).padStart(
          2,
          "0"
        )}:${String(second).padStart(2, "0")}`}
      </StudyTime>
      <MemoComponent />
      {start === true ? <StopWatchDetailComponent /> : <StopWatchComponent />}
      <RecordComponent />
    </Main>
  );
};

export default MainComponent;
