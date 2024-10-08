import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState, tokenState } from "../../Utils/Atom";

import styles from "../Style/Posting.module.css";

import PostingFunction from "../Function/PostingFunction";
import JWTTestFunction from "../../Utils/Function/JWTTestFunction";
import LoadCategoryFunction from "../Function/LoadCategoryFunction";

import Title from "../Component/Title";
import Content from "../Component/Content";
import Catetory from "../Component/Category";
import Tag from "../Component/Tag";
import CategoryList from "../Component/CategoryList";

import Header from "../../Utils/Component/Header";
import BackButton from "../../Utils/Component/BackButton";

/**
 * 게시글 작성 페이지 컴포넌트
 *
 * @returns {JSX.Element} 게시글 작성 페이지를 표시하는 JSX 요소
 */
function PostingPage() {
  const navigate = useNavigate();

  const token = useRecoilValue(tokenState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const [postTitle, setPostTitle] = useState("");
  const [postContents, setPostContents] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");

  const [categoryList, setCategoryList] = useState([]);

  /**
   * 게시글을 작성하는 비동기 함수
   *
   * @async
   * @function Posting
   * @returns {Promise<void>}
   */
  async function Posting() {
    if (postTitle === "") {
      alert("제목을 입력해주세요.");
      return;
    }

    if (postContents === "") {
      alert("내용을 입력해주세요.");
      return;
    }

    if (category === "") {
      alert("카테고리를 선택해주세요.");
      return;
    }

    const result = await PostingFunction({
      token: token,
      postTitle: postTitle,
      postContents: postContents,
      imageSeqs: [],
      tags: tags,
      category: category,
      isPinned: "0",
    });

    if (result.result) {
      alert("포스팅 성공");
      navigate(`/post/${result.postSeq}`);
      return;
    }

    alert("포스팅 실패");
    return;
  }

  /**
   * JWT 토큰을 검사하여 세션이 유효한지 확인하는 비동기 함수
   *
   * @async
   * @function JWT
   * @returns {Promise<void>}
   */
  async function JWT() {
    const result = await JWTTestFunction({ token });

    if (result.code === "01") return;

    setIsLoggedIn(false);
    alert("세션이 만료되었습니다. 다시 로그인 해주세요");
    navigate("/");
    return;
  }

  /**
   * 카테고리 목록을 로드하는 비동기 함수
   *
   * @async
   * @function LoadCategory
   * @returns {Promise<void>}
   */
  async function LoadCategory() {
    const result = await LoadCategoryFunction();

    if (result.result) {
      setCategoryList(result.categoryList || []);
      return;
    }

    alert("카테고리를 불러오는 중 오류가 발생했습니다.");
    return;
  }

  useEffect(() => {
    JWT();
    LoadCategory();
  }, []);

  if (categoryList) {
    return (
      <>
        <Helmet title="Posting" />
        <Header />
        <div className={styles.outer_post_box}>
          <div className={styles.post_box}>
            <div style={{ marginLeft: "30px" }}>
              <BackButton />
            </div>
            <Title title={postTitle} setTitle={setPostTitle} />
            <Catetory category={category} setCategory={setCategory} />
            <div className={styles.categorylist}>
              <CategoryList
                categoryList={categoryList}
                setCategory={setCategory}
              />
            </div>
            <Tag tag={tags} setTag={setTags} />
            <Content content={postContents} setContent={setPostContents} />
            <div className={styles.button}>
              <button onClick={Posting}>글 작성하기</button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default PostingPage;
