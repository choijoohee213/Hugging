import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import classes from "./CounselDone.module.css";
import Card from "../../components/ui/Card";

import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CounselDone = () => {
  // Editor DOM 선택용
  const editorRef = useRef();
  const navigate = useNavigate();

  let counselorId = useSelector((state) => state.nowCounsel.counselorId);
  let counselorName = useSelector((state) => state.nowCounsel.counselorName);
  let subject = useSelector((state) => state.nowCounsel.subject);
  let date = useSelector((state) => state.nowCounsel.date);
  let time = useSelector((state) => state.nowCounsel.time);

  const [nickname, setNickname] = useState();

  const cancleClickHandler = () => {
    navigate("/counselreserve");
  };

  // 작성완료 버튼 클릭
  const registerClilckHandler = () => {
    // 입력창에 입력한 내용을 HTML 태그 형태로 취득
    // console.log(editorRef.current?.getInstance().getHTML());
    // 입력창에 입력한 내용을 MarkDown 형태로 취득
    // console.log(editorRef.current?.getInstance().getMarkdown());

    // 필요 내용
    // content, counselorId, memberId, score
    // 일단 더미 데이터 넣어서 실험해보기
    counselorId = 10;
    const content = editorRef.current?.getInstance().getMarkdown();
    if (content.trim() === "") {
      alert("댓글을 입력해 주세요.");
      return;
    }

    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        id: 10,
        age: 20,
        counselList: [],
        email: "doohui96@naver.com",
        favoriteCounselorList: [],
        favoriteMusicList: [],
        gender: "FEMALE",
        nickname: "주히",
        profileImage: 1,
      })
    );

    const loadedUserProfile = localStorage.getItem("userProfile");
    let memberId = undefined;
    if (loadedUserProfile !== null) {
      const parsedUser = JSON.parse(loadedUserProfile);
      // console.log(parsedUser.id);
      memberId = parsedUser.id;
    }

    const score = 4;

    const review = {
      content,
      counselorId,
      memberId,
      score,
    };

    fetchReview(review);
  };

  // 댓글 작성
  const fetchReview = async (review) => {
    try {
      const response = await fetch(
        "https://j7b204.p.ssafy.io/api/counselors/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // 이 헤더를 통해 어떤 컨텐츠가 전달되는지 알 수 있음
          },
          body: JSON.stringify(review),
        }
      ); // 프로미스 객체 반환
      if (!response.ok) {
        throw new Error("Something went wront!");
      }
      const data = await response.json(); // 프로미스 객체 반환
      console.log(data.data);
      if (data.data === "OK") {
        alert("댓글을 작성했습니다.");
      } else {
        alert("작성 중 오류가 발생했습니다.");
      }

      navigate("/counselreserve");
    } catch (error) {
      console.log(error.message);
    }
  };

  // 화면 들어왔을 때 실행
  useEffect(() => {
    const loadedUserProfile = localStorage.getItem("userProfile");
    if (loadedUserProfile !== null) {
      const parsedUser = JSON.parse(loadedUserProfile);
      setNickname(parsedUser.nickname);
    }
  }, []);

  const getFormatDate = () => {
    const date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    let day = date.getDate();
    day = day >= 10 ? day : "0" + day;

    return year + "-" + month + "-" + day;
  };

  return (
    <div>
      <div className={classes.pink}>
        <div className={classes.title}>상담완료!</div>
        <div>좋은 상담 시간이었나요?</div>
        <div>상담에 대한 리뷰를 남겨주세요.</div>
      </div>
      <Card className={classes.back}>
        <img src="./sampleCounselorSquare.png"></img>
        <div>
          <div>
            {/* <span>{counselorName} 상담사</span> */}
            <span>{counselorName} 이미소 상담사</span>
            <img src="./genderM.png"></img>
          </div>
          <div>일시</div>
          <div>
            {/* {date} {time} */}
            2022/10/05 11:00 ~ 12:00
          </div>
        </div>
      </Card>
      <div className={classes.title2}>리뷰 작성</div>
      <div>
        <span>{nickname}님(익명)</span>
        <span>{getFormatDate()}</span>
      </div>
      <div>
        <img src="./Star.png"></img>
        <img src="./Star.png"></img>
        <img src="./Star.png"></img>
        <img src="./Star.png"></img>
        <img src="./Star.png"></img>
      </div>
      <div>
        {/* <CKEditor
          editor={ClassicEditor}
          config={{
            placeholder: "리뷰를 입력해주세요",
          }}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        /> */}
        <Editor
          // placeholder="내용을 입력해주세요."
          ref={editorRef} // DOM 선택용 useRef
          previewStyle="vertical" // 미리보기 스타일 지정
          height="300px" // 에디터 창 높이
          initialEditType="wysiwyg" // 초기 입력모드 설정(디폴트 markdown)
          toolbarItems={[
            // 툴바 옵션 설정
            ["heading", "bold", "italic", "strike"],
            ["hr", "quote"],
            ["ul", "ol", "task", "indent", "outdent"],
            ["table", "image", "link"],
            ["code", "codeblock"],
          ]}
        ></Editor>
      </div>
      <div>
        <button className={classes.cancel} onClick={cancleClickHandler}>
          취소
        </button>
        <button className={classes.done} onClick={registerClilckHandler}>
          작성 완료
        </button>
      </div>
    </div>
  );
};

export default CounselDone;
