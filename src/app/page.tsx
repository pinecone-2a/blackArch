import Image from "next/image";
import Template from "./_components/template";
import Page from "./home/page";
export default function Home() {
  return (
    <div>
      {" "}
      <Template>
        {" "}
        <Page />
      </Template>
    </div>
  );
}
