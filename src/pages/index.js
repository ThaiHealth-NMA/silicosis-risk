import Menu from "@/components/home/Menu";
import Head from "next/head";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-accent-light flex flex-col justify-between">
      <Head>
        <title>
          ระบบประเมินความเสี่ยงทางสุขภาพจากการรับสัมผัสฝุ่นซิลิกา
          กลุ่มอาชีพแกะสลักหิน อ.สีคิ้ว จ.นครราชสีมา
        </title>
        <meta name="description" content="Health Risk Assessment Application" />
      </Head>

      <div className="max-w-[1024px] w-full mx-auto flex flex-col md:flex-row justify-between text-bases-content p-5 gap-3">
        <div>
          <h1 className="text-2xl">ยินดีต้อนรับ!</h1>
          <h2 className="text-xl">
            เข้าสู่ระบบประเมินความเสี่ยงทางสุขภาพจากการรับสัมผัสฝุ่นซิลิกา
          </h2>
          <h2 className="text-xl">
            กลุ่มอาชีพแกะสลักหิน อ.สีคิ้ว จ.นครราชสีมา
          </h2>
        </div>
        <div className="bg-bases rounded-2xl py-2 px-4">
          <span className="flex justify-center text-sm text-center mb-2">
            จัดทำและสนับสนุนโดย
          </span>
          <div className="flex flex-row items-center justify-around">
            <Image
              src="/logo/logo-fphtu.png"
              alt="logo-fphtu"
              className="h-[80px]"
              width={100}
              height={100}
            />
            <Image
              src="/logo/logo-thaihealth.png"
              alt="logo-thaihealth"
              className="h-[80px]"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>

      <main className="bottom-0 max-w-[1024px] bg-bases-light w-full mx-auto p-5 rounded-t-3xl pb-10">
        <Menu />
      </main>
    </div>
  );
}
