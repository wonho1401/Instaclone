import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

//multer-s3 는 아마존 웹 서버에 파일들을 업로드할 수 있게 해줌.
//aws-sdk는 aws를 이용하는데 사용하는듯(?)

//s3라는 것을 만들어서 내 aws S3에 접근

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "ap-northeast-2",
});
//multer를 이용해 이미지 업로드함. 저장장소를 설정하는것.
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "w0noinsta",
    acl: "public-read",
    //acl을 통해서 public-read속성을 해줘야 aws의 파일에 접근이 가능해짐.
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

export const uploadMiddleware = upload.single("file");
export const uploadController = (req, res) => {
  const {
    file: { location },
  } = req;
  res.json({ location });
};
