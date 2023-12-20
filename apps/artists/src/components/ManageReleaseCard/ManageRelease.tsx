/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const ManageCard = () => {
  return (
    <div className="w-[23vw] h-[16vw] backdrop-blur-[24px] shadow-[2px_4px_48px_0px_rgba(0,_0,_0,_0.5)] bg-[linear-gradient(159deg,_rgba(28,_30,_34,_0.33)_-9%,rgba(31,_34,_40,_0.5)_113%)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-col justify-end gap-2 items-start pt-4 px-2 rounded-[24px]">
      <div />
      <div />
      <div className="text-xl font-['Aileron'] font-light leading-[28px] text-white ml-4 mt-4 ">
        Discography
      </div>

      <div />

      <div className="bg-[rgba(28,_30,_34,_0.8)] flex flex-col gap-3 justify-end w-full h-[12vw] items-start pl-2 pt-4 rounded-3xl">
        <div className="text-xl font-['Aileron'] leading-[24px] text-white items-center w-3/5">
          Manage your published music
        </div>
        <div className="pr-[1vw] w-full">
          <Link href={"/manageRelease"}>
            <div className=" backdrop-blur-[24px] bg-[linear-gradient(159deg,_rgba(28,_30,_34,_0.33)_-9%,rgba(31,_34,_40,_0.5)_113%)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-row justify-between w-full h-12 items-start pt-3 px-4 hover:border rounded-[24px]">
              <div className="text-sm font-['Aileron'] leading-[20px] text-white">
                Manage Releases
              </div>
              <img
                src="https://file.rendit.io/n/2MsiJ95iJMNwJITgevH6.svg"
                alt="Vector"
                className="mt-1 w-3"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManageCard;
