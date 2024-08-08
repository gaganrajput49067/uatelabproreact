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
