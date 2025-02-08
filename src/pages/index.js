import Menu from "@/components/home/Menu";
import Head from "next/head";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-accent-light flex flex-col justify-between">
      <Head>
        <title>ประเมินความเสี่ยงสุขภาพแกะสลักหิน จ.นครราชสีมา</title>
        <meta
          name="description"
          content="Silicosis Risk Assessment Application"
        />
        <link rel="icon" href="/logo/thaihealth-lpg-logo.svg" />
      </Head>

      <div className="max-w-[1024px] w-full mx-auto flex flex-col items-center xl:flex-row-reverse justify-around text-bases-content p-5 md:pt-10 gap-10">
        <div className="flex flex-col justify-center w-full text-center md:gap-2">
          <h2 className="text-2xl md:text-4xl font-extrabold w-full text-secondary-light-content">
            ประเมินความเสี่ยงสุขภาพ
          </h2>
          <h2 className="text-xl md:text-4xl font-semibold ">
            กลุ่มอาชีพแกะสลักหิน
          </h2>
          <h2 className="text-xl md:text-4xl">อ.สีคิ้ว จ.นครราชสีมา</h2>
        </div>
        <Image
          src="/logo/thaihealth-nma-logo.svg"
          alt="logo-thaihealth"
          className="md:max-w-[80%] xl:max-w-[50%] flex justify-center"
          width={300}
          height={300}
        />
      </div>

      <main className="bottom-0 max-w-[1024px] bg-bases-light w-full mx-auto p-5 rounded-t-3xl pb-6">
        <Menu />
      </main>
    </div>
  );
}
