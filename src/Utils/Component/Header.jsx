import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRecoilState } from "recoil";
import { ColorState, isLoggedInState } from "../Atom";

import styles from "./Style/component.module.css";

import LoadAccountFunction from "../../Account/Function/LoadAccountFunction";
import accountIcon from "../Asset/person_white.png";

function Header() {
  const navigate = useNavigate();

  const [title, setTitle] = useState(null);
  const [color, setColor] = useRecoilState(ColorState);
  const [isLoggedIn] = useRecoilState(isLoggedInState);

  async function LoadAccount() {
    const result = await LoadAccountFunction();

    if (result.result) {
      setTitle(result.profileResult.title);
      setColor({ background: result.profileResult.color });
    }

    return;
  }

  useEffect(() => {
    LoadAccount();
  }, []);

  if (title) {
    return (
      <>
        <div
          className={styles.header}
          style={{ backgroundColor: color.background }}
        >
          <div className={styles.leftbox}>
            {isLoggedIn && (
              <div onClick={() => navigate("/posting")}>
                <p>Posting</p>
              </div>
            )}
          </div>
          <p
            style={{ fontFamily: "Times New Roman" }}
            onClick={() => navigate("/")}
          >
            {title}
          </p>

          <div className={styles.rightbox}>
            {isLoggedIn && (
              <img
                src={accountIcon}
                alt=""
                onClick={() => navigate("/admin")}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Header;
