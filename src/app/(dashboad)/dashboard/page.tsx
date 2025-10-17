import { Button, DataTable } from "@/components/atoms";
import RequestCard from "@/components/molecules/request-card";

export default function TeamTable() {
  const columns = [
    { key: "name", header: "Name" },
    { key: "state", header: "State" },
    { key: "industry", header: "Industry" },
    { key: "skills", header: "Skill stack" },
    { key: "hasStartup", header: "Has a startup?" },
  ];

  const data = [
    {
      name: "Tony Korotoe",
      state: "Ekiti",
      industry: "Fintech",
      skills: "UI/UX, Python, HTML",
      hasStartup: <p className="text-red-500">yo</p>,
    },
    {
      name: "Musa Amoo",
      state: "Oyo",
      industry: "Game Dev",
      skills: "C, C++, C#",
      hasStartup: <p className="text-red-500">yo</p>,
    },
    {
      name: "Stephen Emeka",
      state: "Edo",
      industry: "GovTech",
      skills: "GovTech",
      hasStartup: <p className="text-red-500">yo</p>,
    },
    {
      name: "Dara Olukoton",
      state: "Ogun",
      industry: "EdTech",
      skills: "Python, Java",
      hasStartup: <p className="text-red-500">yo</p>,
    },
    {
      name: "Manta Moses",
      state: "Rivers",
      industry: "FinTech",
      skills: "Python, HTML, C",
      hasStartup: <p className="text-red-500">yo</p>,
    },
  ];

  const RequestCardProps = {
    image: "/jpg/no-image.jpg",
    alt: "string",
    name: "Chido Obi",
    email: "creativeobi@gmail.com",
    available: "Onsite - Remote",
    timeAvailable: "160h 55m",
    details:
      "A collaborative developer with innovative ideas and industry valued experience and top notch technicality",
    keyValue: {
      department: "string",
      role: "string",
      backgroundColour: "string",
      dotColour: "string",
    },
  };
  return (
    <section className="flex flex-col gap-6">
      <section className="bg-white py-2 rounded-2xl">
        <div className="flex justify-between items-center px-4 py-2">
          <p className="font-semibold text-[1.2em]">Suggestions</p>
          <Button variant="outline" className="m-0">
            See All
          </Button>
        </div>
        <DataTable columns={columns} data={data} />
      </section>
      <section className="bg-[#F3F4F6] p-2 rounded-2xl">
        <p className="font-semibold text-[1.2em]">Co-founder Requests</p>
        <div className="flex flex-col gap-4">
          <RequestCard props={RequestCardProps} />
          <RequestCard props={RequestCardProps} />
          <RequestCard props={RequestCardProps} />
          <RequestCard props={RequestCardProps} />
          <RequestCard props={RequestCardProps} />
          <RequestCard props={RequestCardProps} />
        </div>
      </section>
    </section>
  );
}
