import { Button, Result } from "antd";
const NotFoundPage: React.FC = () => (
  <div className="w-screen h-screen flex justify-center items-center">
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="link" href="/">
          Back Home
        </Button>
      }
    />
  </div>
);

export default NotFoundPage;
