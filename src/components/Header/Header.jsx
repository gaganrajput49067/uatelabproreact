import React from "react";
import "../../zStyles/Header.css";
import defaultUserImg from "../../assets/image/user.png";
import { toggleFullScreen } from "../../utils/helpers";
import Input from "../CommonComponent/Input";
const Header = () => {
  return (
    <div className="header-main-container">
      <div className="header-item-container">
        <div className="header-visit">
          <div className="maindiv">
            <Input
              type="text"
              className="form-control"
              id="text"
              name="userName"
              lable={"Visit No. / Barcode No."}
              placeholder=" "
              // value={payload?.userName}
              // onChange={handleChange}
            />
          </div>
        </div>
        <i class="fas fa-palette mr-3 pointer"></i>
        <i class="fa fa-home mr-3 pointer"></i>
        <i
          class="fa fa-expand mr-3 pointer"
          aria-hidden="true"
          onClick={toggleFullScreen}
        ></i>
        <div className="user-Info-container pointer">
          <img
            src={defaultUserImg}
            alt=""
            srcset=""
            className="user-info-image"
          />
          &nbsp;&nbsp;&nbsp;
          <span>Itd-Admin</span>
        </div>
        <i class="fa fa-sign-out ml-2" aria-hidden="true"></i>
      </div>
    </div>
  );
};

export default Header;
