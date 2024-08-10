import moment from "moment/moment";
import { toast } from "react-toastify";

const getS3url = async (id) => {
  if (id && id !== "") {
    try {
      const res = await axios.post("/api/v1/CommonController/GetFileUrl", {
        Key: id,
      });
      return res?.data?.message;
    } catch (err) {
      console.log(err);
    }
  } else {
    toast.error("No Image found");
  }
};

export const getS3FileData = async (guidNumber, pageName) => {
  let Data = [];
  try {
    const res = await axios.post("/api/v1/CommonController/GetDocument", {
      Page: pageName,
      Guid: guidNumber,
    });
    Data = res?.data?.message;
  } catch (err) {
    console.log(err);
  }
  const upDatedData = await Promise.all(
    Data.map(async (data) => {
      const fileUrl = await getS3url(data?.awsKey);
      return { ...data, fileUrl };
    })
  );
  return upDatedData;
};

export const guidNumber = () => {
  const guidNumber =
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4();

  return guidNumber;
};

export function getGreeting(type) {
  const now = new Date();

  if (type === "date") {
    return moment(now).format("MMM D, yyyy");
  }

  const hours = now.getHours();

  if (type === "greeting") {
    if (hours < 12) {
      return "Good Morning";
    } else if (hours < 18) {
      return "Good Afternoon";
    } else if (hours < 22) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  }

  if (type === "month") {
    const currentMonth = moment(now).format("MMMM");
    const previousMonth1 = moment(now).subtract(1, "months").format("MMMM");
    const previousMonth2 = moment(now).subtract(2, "months").format("MMMM");
    return [currentMonth, previousMonth1, previousMonth2];
  }

  if (type === "day") {
    return moment(now).format("dddd");
  }
}
