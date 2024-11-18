import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { PreventSpecialCharacterandNumber } from "../util/Commonservices";
import { AllowCharactersNumbersAndSpecialChars } from "../../utils/helpers";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";

const LocationMaster = () => {
  const [formData, setFormdata] = useState({
    LocalityID: "",
    update: false,
    BusinessZoneName: "",
    IsActive: [false, false, false, false, false],
    loading: [false, false, false, false, false],
    regions: [],
    states: [],
    zonelist: [],
    regionforstate: "",
    regionforcity: "",
    newState: "",
    zoneid: "",
    cityregion: "",
    stateforcity: "",
    newcity: "",
    regionforlocality: "",
    stateforlocality: "",
    cityforlocality: "",
    statesforlocality: [],
    citiesforlocality: [],
    cities: [],
    locality: "",
    stateZone: "",
  });
  const [searchData, setSearchData] = useState({
    searchZone: "",
    searchState: "",
    searchCity: "",
    states: [],
    cities: [],
  });
  const [show, setShow] = useState({
    zone: false,
    state: false,
    city: false,
    location: false,
  });
  const [create, setCreate] = useState("zone");

  const [updateLoading, setUpdateLoading] = useState([false, false]);
  const [showState, setShowState] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [showzone, setShowZone] = useState(false);
  const [locationTable, setLocationTable] = useState([]);
  const [ModifyState, setModifyState] = useState({
    initialZone: "",
    finalZone: "",
    State: "",
    IsActive: false,
    StateID: "",
    states: [],
    cities: [],
  });
  const [ModifyCity, setModifyCity] = useState({
    regionmodifycity: "",
    statemodifycity: "",
    cityTomodify: "",
    newcity: "",
    IsActive: false,
    states: [],
    cities: [],
  });
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;

    if (name == "stateforlocality") {
      if (value != "") {
        bindCities(value);
      }
      setFormdata({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
        citiesforlocality: [],
        cityforlocality: "",
      });
    } else if (name == "cityregion") {
      if (value != "") {
        bindStates(value, "states");
      }
      setFormdata({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
        states: [],
        stateforcity: "",
      });
    } else if (name == "regionforlocality") {
      if (value != "") {
        bindStates(value, "statesforlocality");
      }
      setFormdata({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
        citiesforlocality: [],
        cityforlocality: "",
        stateforlocality: "",
        statesforlocality: [],
      });
    } else if (name == "newState" || name == "newcity") {
      if (PreventSpecialCharacterandNumber(value)) {
        setFormdata({ ...formData, [name]: value });
      }
    } else if (name === "BusinessZoneName") {
      if (PreventSpecialCharacterandNumber(value)) {
        setFormdata({ ...formData, [name]: value });
      }
    } else if (name == "locality") {
      if (AllowCharactersNumbersAndSpecialChars(value)) {
        setFormdata({ ...formData, [name]: value });
      }
    } else {
      setFormdata({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };
  const handleSaveZone = () => {
    console.log(formData);
    setFormdata((prevFormData) => ({
      ...prevFormData,
      loading: prevFormData.loading.map((value, index) =>
        index === 0 ? true : value
      ),
    }));

    if (formData?.BusinessZoneName.trim().length > 2) {
      axiosInstance
        .post("LocationMaster/SaveZone", {
          BusinessZoneName: formData?.BusinessZoneName.trim(),
          IsActive: formData?.IsActive[0] == true ? "1" : "0",
        })
        .then((res) => {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Zone created successfully"
          );
          setFormdata({
            ...formData,
            BusinessZoneName: "",
            IsActive: [false, ...formData.IsActive.slice(1)],
            loading: formData.loading.map((value, index) =>
              index === 0 ? false : value
            ),
          });
          window.location.reload();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Could not Save"
          );
          setFormdata((prevFormData) => ({
            ...prevFormData,
            loading: prevFormData.loading.map((value, index) =>
              index === 0 ? false : value
            ),
          }));
        });
    } else {
      toast.error("Zone Name must have 3 characters");
      setFormdata((prevFormData) => ({
        ...prevFormData,
        loading: prevFormData.loading.map((value, index) =>
          index === 0 ? false : value
        ),
      }));
    }
  };
  const handleSearch = () => {
    setFormdata((prevFormData) => ({
      ...prevFormData,
      loading: prevFormData.loading.map((value, index) =>
        index === 4 ? true : value
      ),
    }));

    console.log(searchData);
    let payload = {
      StateID: searchData?.searchState,
      BusinessZoneID: searchData?.searchZone,
      CityID: searchData?.searchCity,
    };
    axiosInstance
      .post("LocationMaster/GetLocality", payload)
      .then((res) => {
        console.log(res?.data?.message);
        setLocationTable(res?.data?.message);
        setFormdata((prevFormData) => ({
          ...prevFormData,
          loading: prevFormData.loading.map((value, index) =>
            index === 4 ? false : value
          ),
        }));
      })
      .catch((err) => {
        toast.error(err?.response?.data.message);
        setFormdata((prevFormData) => ({
          ...prevFormData,
          loading: prevFormData.loading.map((value, index) =>
            index === 4 ? false : value
          ),
        }));
      });
  };

  const editLocation = (ele) => {
    console.log(ele);
  };
  const handleModal = (type) => {
    switch (type) {
      case "state":
        setShowState(true);
        break;
      case "city":
        setShowCity(true);
        break;
      case "zone":
        setShowZone(true);
        break;
    }
  };

  const getRegions = () => {
    axiosInstance
      .get("LocationMaster/GetZone")
      .then((res) => {
        const regions = res.data.message.map((region) => ({
          label: region.BusinessZoneName,
          value: region.BusinessZoneID,
        }));

        setFormdata((prevFormData) => ({
          ...prevFormData,
          regions: regions,
        }));
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };
  const bindStates = (value, name) => {
    console.log(name);
    axiosInstance
      .post("LocationMaster/GetState", {
        BusinessZoneID: value,
      })
      .then((res) => {
        const states = res.data.message.map((region) => ({
          label: region.State,
          value: region.StateId,
        }));

        setFormdata((prevFormData) => ({
          ...prevFormData,
          [name]: states,
        }));
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong"
        );
      });
  };

  const handleCityUpdate = () => {
    console.log(ModifyCity);
    setUpdateLoading([false, true]);
    let payload = {
      City: ModifyCity?.newcity.trim(),
      CityID: ModifyCity?.cityTomodify,
      IsActive: ModifyCity?.IsActive ? "1" : "0",
    };
    if (payload?.City.length > 2) {
      axiosInstance
        .post("LocationMaster/UpdateCity", payload)
        .then((res) => {
          toast.success("City updated successfully");
          setModifyCity({
            regionmodifycity: "",
            statemodifycity: "",
            cityTomodify: "",
            newcity: "",
            IsActive: false,
            states: [],
            cities: [],
          });
          window.location.reload();
          setUpdateLoading([false, false]);
          setShowCity(false);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          setUpdateLoading([false, false]);
        });
    } else {
      setUpdateLoading([false, false]);
      toast.error("City Name should have atleast 3 character");
    }
  };

  const handleSavestate = () => {
    console.log(formData);
    setFormdata((prevFormData) => ({
      ...prevFormData,
      loading: prevFormData.loading.map((value, index) =>
        index === 1 ? true : value
      ),
    }));

    const payload = {
      State: formData?.newState.trim(),
      IsActive: formData?.IsActive[1] == true ? "1" : "0",
      BusinessZoneID: formData?.stateZone,
    };
    if (payload?.State.length > 3) {
      axiosInstance
        .post("LocationMaster/SaveState", payload)
        .then((res) => {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "State created successfully"
          );
          setFormdata({
            ...formData,
            newState: "",
            stateZone: "",
            IsActive: [
              formData.IsActive[0],
              false,
              ...formData.IsActive.slice(2),
            ],
            loading: formData?.loading.map((value, index) =>
              index === 1 ? false : value
            ),
          });
          window.location.reload();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Could not Save"
          );
          setFormdata((prevFormData) => ({
            ...prevFormData,
            loading: prevFormData.loading.map((value, index) =>
              index === 1 ? false : value
            ),
          }));
        });
    } else {
      setFormdata((prevFormData) => ({
        ...prevFormData,
        loading: prevFormData.loading.map((value, index) =>
          index === 1 ? false : value
        ),
      }));
      toast.error("State Name Must have 3 characters");
    }
  };

  const handleCheckboxChange = (event, index) => {
    const { name, checked } = event.target;

    setFormdata((prevFormData) => {
      let updatedIsActive = [...prevFormData.IsActive];
      updatedIsActive[index] = checked;

      return {
        ...prevFormData,
        IsActive: updatedIsActive,
      };
    });
  };
  const handleSaveCity = () => {
    setFormdata((prevFormData) => ({
      ...prevFormData,
      loading: prevFormData.loading.map((value, index) =>
        index === 2 ? true : value
      ),
    }));

    const payload = {
      City: formData?.newcity,
      StateID: formData?.stateforcity,
      IsActive: formData?.IsActive[2] == true ? "1" : "0",
    };
    if (payload?.City.trim().length > 2) {
      axiosInstance
        .post("LocationMaster/SaveCity", payload)
        .then((res) => {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "City Created Successfully"
          );
          setFormdata({
            ...formData,
            cityregion: "",
            stateforcity: "",
            newcity: "",
            loading: formData.loading.map((value, index) =>
              index === 2 ? false : value
            ),
            IsActive: [
              formData.IsActive[0],
              formData.IsActive[1],
              false,
              ...formData.IsActive.slice(3),
            ],
          });
          window.location.reload();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Could not save"
          );
          setFormdata((prevFormData) => ({
            ...prevFormData,
            loading: prevFormData.loading.map((value, index) =>
              index === 2 ? false : value
            ),
          }));
        });
    } else {
      setFormdata((prevFormData) => ({
        ...prevFormData,
        loading: prevFormData.loading.map((value, index) =>
          index === 2 ? false : value
        ),
      }));
      toast.error("City Name must have 3 characters");
    }
  };
  const getIsActive = (value, Type) => {
    console.log(value, Type);
    const getSelected = Type.filter((ele) => {
      return ele.value == value;
    });
    console.log(getSelected);
    return getSelected[0].IsActive;
  };
  const handleEditLocality = (ele) => {
    console.log(ele);
    setCreate("location");
    bindStates(ele?.BusinessZoneID, "statesforlocality");
    bindCities(ele?.StateID);
    const isActive = ele?.Active == "Yes";
    setFormdata({
      ...formData,
      regionforlocality: ele?.BusinessZoneID,
      stateforlocality: ele?.StateID,
      cityforlocality: ele?.CityID,
      locality: ele?.LocalityName,
      update: true,
      LocalityID: ele?.ID,
      IsActive: [
        formData.IsActive[0],
        formData.IsActive[1],
        formData.IsActive[2],
        isActive,
        ...formData.IsActive.slice(4),
      ],
    });
    window.scroll(0, 0);
  };

  console.log(formData);

  const bindCities = (value) => {
    axiosInstance
      .post("LocationMaster/bindCity", {
        StateID: value,
      })
      .then((res) => {
        const data = res?.data?.message;

        const cities = data.map((item) => {
          return {
            label: item?.City,
            value: item?.ID,
          };
        });

        setFormdata((prevFormData) => ({
          ...prevFormData,
          citiesforlocality: cities,
        }));
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const handleSaveLocality = () => {
    setFormdata((prevFormData) => ({
      ...prevFormData,
      loading: prevFormData.loading.map((value, index) =>
        index === 3 ? true : value
      ),
    }));

    const payload = {
      Locality: formData?.locality.trim(),
      ZoneID: formData?.regionforlocality,
      StateID: formData?.stateforlocality,
      CityID: formData?.cityforlocality,
      IsActive: formData?.IsActive[3] == true ? "1" : "0",
    };

    if (payload?.Locality.length > 2) {
      axiosInstance
        .post("LocationMaster/SaveLocality", payload)
        .then((res) => {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Locality Created Successfully"
          );
          setFormdata({
            ...formData,
            locality: "",
            regionforlocality: "",
            stateforlocality: "",
            cityforlocality: "",
            citiesforlocality: [],
            statesforlocality: [],
            loading: formData.loading.map((value, index) =>
              index === 3 ? false : value
            ),
            IsActive: [
              formData.IsActive[0],
              formData.IsActive[1],
              formData.IsActive[2],
              false,
              ...formData.IsActive.slice(4),
            ],
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Could not save"
          );
          setFormdata({
            ...formData,
            loading: formData.loading.map((value, index) =>
              index === 3 ? false : value
            ),
          });
        });
    } else {
      toast.error("Locality length must have 3 characters");
      setFormdata((prevFormData) => ({
        ...prevFormData,
        loading: prevFormData.loading.map((value, index) =>
          index === 3 ? false : value
        ),
      }));
    }
  };
  const handleSearchChange = (e) => {
    const { name, value } = e?.target;
    if (name == "searchZone") {
      if (value != "") {
        bindsearchstates(value);
      }
      setSearchData({
        ...searchData,
        [name]: value,
        states: [],
        cities: [],
        searchCity: "",
        searchState: "",
      });
      // const [searchData,setSearchData]=useState({
      //     searchZone:'',
      //     searchState:'',
      // searchCity:'',
      // states:[],
      // cities:[]})
    } else if (name == "searchState") {
      if (value != "") {
        bindsearchCities(value);
      }
      setSearchData({
        ...searchData,
        [name]: value,
        cities: [],
        searchCity: "",
      });
    } else if (name == "searchCity") {
      setSearchData({ ...searchData, [name]: value });
    }
  };
  const bindsearchstates = (value) => {
    axiosInstance
      .post("LocationMaster/GetState", {
        BusinessZoneID: value,
      })
      .then((res) => {
        const states = res.data.message.map((region) => ({
          label: region.State,
          value: region.StateId,
        }));

        setSearchData((prevFormData) => ({
          ...prevFormData,
          states: states,
        }));
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong"
        );
      });
  };
  const bindsearchCities = (value) => {
    axiosInstance
      .post("LocationMaster/bindCity", {
        StateID: value,
      })
      .then((res) => {
        const data = res?.data?.message;

        const cities = data.map((item) => {
          return {
            label: item?.City,
            value: item?.ID,
          };
        });

        setSearchData((prevFormData) => ({
          ...prevFormData,
          cities: cities,
        }));
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };
  const handleModifyState = (e) => {
    const { name, value, type, checked } = e?.target;
    if (name == "initialZone") {
      axiosInstance
        .post("LocationMaster/GetAllState", {
          BusinessZoneID: value,
        })
        .then((res) => {
          const states = res.data.message.map((region) => ({
            label: region.State,
            value: region.StateId,
            IsActive: region.IsActive == 1 ? true : false,
          }));

          setModifyState({
            ...ModifyState,
            states: states,
            [name]: value,
            StateID: "",
            State: "",
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong"
          );
          setModifyState({
            ...ModifyState,
            [name]: value,
            states: [],
            StateID: "",
            State: "",
          });
        });
    } else if (name == "State") {
      if (PreventSpecialCharacterandNumber(value)) {
        setModifyState({
          ...ModifyState,
          [name]: type === "checkbox" ? checked : value,
        });
      }
    } else if (name == "StateID") {
      if (value != "") {
        setModifyState({
          ...ModifyState,
          [name]: value,
          State: "",
          IsActive: getIsActive(value, ModifyState?.states),
        });
      }
    } else {
      setModifyState({
        ...ModifyState,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };
  const handleModifyCity = (e) => {
    const { name, value, type, checked } = e?.target;
    if (name == "regionmodifycity") {
      axiosInstance
        .post("LocationMaster/GetAllState", {
          BusinessZoneID: value,
        })
        .then((res) => {
          const states = res.data.message.map((region) => ({
            label: region.State,
            value: region.StateId,
          }));
          console.log(res.data.message, states);

          setModifyCity({
            ...ModifyCity,
            states: states,
            [name]: value,
            cities: [],
            statemodifycity: "",
            cityTomodify: "",
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong"
          );
          setModifyCity({
            ...ModifyCity,
            [name]: value,
            states: [],
            cities: [],
            statemodifycity: "",
            cityTomodify: "",
          });
        });
    } else if (name == "statemodifycity") {
      axiosInstance
        .post("LocationMaster/bindAllCity", {
          StateID: value,
        })
        .then((res) => {
          const cities = res.data.message.map((region) => ({
            label: region.City,
            value: region.ID,
            IsActive: region?.IsActive,
          }));

          setModifyCity({
            ...ModifyCity,
            cities: cities,
            [name]: value,
            cityTomodify: "",
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong"
          );
          setModifyCity({
            ...ModifyCity,
            cities: [],
            [name]: value,
            cityTomodify: "",
          });
        });
    } else if (name == "cityTomodify") {
      if (value != "") {
        setModifyCity({
          ...ModifyCity,
          [name]: type === "checkbox" ? checked : value,
          IsActive: getIsActive(value, ModifyCity?.cities),
        });
      }
    } else if (name == "newcity") {
      if (PreventSpecialCharacterandNumber(value)) {
        setModifyCity({
          ...ModifyCity,
          [name]: type === "checkbox" ? checked : value,
        });
      } else {
        return;
      }
    } else {
      setModifyCity({
        ...ModifyCity,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };
  console.log(ModifyState);
  const handleUpdateLocality = () => {
    setFormdata((prevFormData) => ({
      ...prevFormData,
      loading: prevFormData.loading.map((value, index) =>
        index === 3 ? true : value
      ),
    }));
    const payload = {
      Locality: formData?.locality.trim(),
      BusinessZoneID: `${formData?.regionforlocality}`,
      StateID: `${formData?.stateforlocality}`,
      CityID: `${formData?.cityforlocality}`,
      IsActive: formData?.IsActive[3] == true ? "1" : "0",
      LocalityID: `${formData?.LocalityID}`,
    };

    if (payload?.Locality.trim().length > 2) {
      axiosInstance
        .post("LocationMaster/UpdateLocality", payload)
        .then((res) => {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Locality Updated Successfully"
          );
          setFormdata({
            ...formData,
            locality: "",
            regionforlocality: "",
            stateforlocality: "",
            cityforlocality: "",
            citiesforlocality: [],
            statesforlocality: [],
            loading: formData.loading.map((value, index) =>
              index === 3 ? false : value
            ),
            IsActive: [
              formData.IsActive[0],
              formData.IsActive[1],
              formData.IsActive[2],
              false,
              ...formData.IsActive.slice(4),
            ],
          });
          handleSearch();
          //   window.location.reload();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Could Not Update"
          );
          setFormdata((prevFormData) => ({
            ...prevFormData,
            loading: prevFormData.loading.map((value, index) =>
              index === 3 ? false : value
            ),
          }));
        });
    } else {
      toast.error(" Locality Name Must have 3 characters");
      setFormdata((prevFormData) => ({
        ...prevFormData,
        loading: prevFormData.loading.map((value, index) =>
          index === 3 ? false : value
        ),
      }));
    }
  };

  const handleStateUpdate = () => {
    console.log(ModifyState);
    setUpdateLoading([true, false]);
    const payload = {
      BusinessZoneID:
        ModifyState?.finalZone != ""
          ? ModifyState?.finalZone
          : ModifyState?.initialZone,
      State: ModifyState?.State.trim(),
      IsActive: ModifyState?.IsActive == true ? "1" : "0",
      StateID: ModifyState?.StateID,
    };
    if (payload?.State.length > 2) {
      axiosInstance
        .post("LocationMaster/UpdateState", payload)
        .then((res) => {
          toast.success("Updated succesfully");
          setShowState(false);
          setModifyState({
            initialZone: "",
            finalZone: "",
            State: "",
            IsActive: false,
            StateID: "",
            states: [],
          });
          window.location.reload();
          setUpdateLoading([false, false]);
        })
        .catch((err) => {
          setUpdateLoading([false, false]);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Could not update"
          );
        });
    } else {
      toast.error("State Name must have 3 characters");
      setUpdateLoading([false, false]);
    }
  };
  useEffect(() => {
    getRegions();
  }, []);
  const handleRadioChange = (event) => {
    setCreate(event?.target?.value);
  };
  return (
    <>
      <PageHead name={t("Location Master")}></PageHead>
      <PageHead name={t("Create")} showDrop="true">
        <div className="card">
          <div className="row">
            <label className="col-sm-1">Select To Create</label>

            <div className="col-sm-1 d-flex align-items-center">
              <input
                type="radio"
                name="create"
                value="zone"
                checked={create == "zone"}
                onChange={handleRadioChange}
              />
              <label className="col-sm-10">Zone</label>
            </div>
            <div className="col-sm-1 d-flex align-items-center">
              <input
                type="radio"
                name="create"
                value="state"
                checked={create == "state"}
                onChange={handleRadioChange}
              />
              <label className="col-sm-10">State</label>
            </div>
            <div className="col-sm-1 d-flex align-items-center">
              <input
                type="radio"
                name="create"
                value="city"
                checked={create == "city"}
                onChange={handleRadioChange}
              />
              <label className="col-sm-10">City</label>
            </div>
            <div className="col-sm-1 d-flex align-items-center">
              <input
                type="radio"
                name="create"
                value="location"
                checked={create == "location"}
                onChange={handleRadioChange}
              />
              <label className="col-sm-10">Location</label>
            </div>
          </div>
        </div>
      </PageHead>
      {create == "zone" && (
        <PageHead name={t("Region")} showDrop="true">
          <div className="card">
            <div className="row">
              <div className="col-sm-2">
                <Input
                  name="BusinessZoneName"
                  id="BusinessZoneName"
                  onChange={handleChange}
                  max={10}
                  value={formData?.BusinessZoneName}
                  placeholder=""
                  lable={"Enter Zone"}
                />
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <input
                  name="regionActive"
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(e, 0)}
                  checked={formData.IsActive[0]}
                />
                <label className="col-sm-10"> {t("IsActive")}</label>
              </div>
              <div className="col-sm-1">
                {!formData?.loading[0] && (
                  <button
                    type="button"
                    className="btn btn-block btn-success btn-sm"
                    onClick={handleSaveZone}
                    disabled={formData?.BusinessZoneName.length == 0}
                  >
                    Save
                  </button>
                )}
                {formData?.loading[0] && <Loading />}
              </div>
            </div>
          </div>
        </PageHead>
      )}
      {create == "state" && (
        <PageHead name={t("State")} showDrop="true">
          <div className="card">
            <div className="row">
              <div className="col-sm-2">
                <SelectBox
                  name="stateZone"
                  id="stateZone"
                  className="form-control input-sm"
                  options={[
                    { label: "Select Zone", value: "" },
                    ...formData?.regions,
                  ]}
                  onChange={handleChange}
                  selectedValue={formData?.stateZone}
                  placeholder=""
                  lable="Zone"
                />
              </div>
              <div className="col-sm-2">
                <Input
                  name="newState"
                  id="newState"
                  onChange={handleChange}
                  max={20}
                  value={formData?.newState}
                  placeholder=""
                  lable={"Enter State"}
                />
              </div>
              <div className="col-sm-1 d-flex align-items-center">
                <input
                  name="stateActive"
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(e, 1)}
                  checked={formData.IsActive[1]}
                />
                <label className="col-sm-10"> {t("IsActive")}</label>
              </div>
              <div className="col-sm-1">
                {!formData?.loading[1] && (
                  <button
                    type="button"
                    className="btn btn-block btn-success btn-sm"
                    onClick={handleSavestate}
                    disabled={formData?.stateZone == ""}
                  >
                    Save
                  </button>
                )}
                {formData?.loading[1] && <Loading />}
              </div>
              <div className="col-sm-1">
                <button
                  type="button"
                  className="btn btn-block btn-warning btn-sm"
                  onClick={() => {
                    handleModal("state");
                  }}
                >
                  Modify
                </button>
              </div>
            </div>
          </div>
        </PageHead>
      )}
      {create == "city" && (
        <PageHead name={t("City")} showDrop="true">
            <div className="card">
                <div className="row">
              <div className="col-sm-2">
              <SelectBox
                  name="cityregion"
                  id="cityregion"
                  className="form-control input-sm"
                  options={[
                    { label: "Select Zone", value: "" },
                    ...formData?.regions,
                  ]}
                  onChange={handleChange}
                  selectedValue={formData?.cityregion}
                  placeholder=""
                  lable="Zone"
                />
              </div>
                </div>
            </div>
        </PageHead>
      )}
    </>
  );
};

export default LocationMaster;
