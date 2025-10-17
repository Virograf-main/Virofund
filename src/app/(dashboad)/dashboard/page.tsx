import { Button, DataTable } from "@/components/atoms";

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

  return (
    <section className="bg-white py-2 rounded-2xl">
      <div className="flex justify-between items-center px-4 py-2">
        <p className="font-semibold text-[1.2em]">Suggestions</p>
        <Button variant="outline" className="m-0">
          See All
        </Button>
      </div>
      <DataTable
        // caption="Team Members"
        columns={columns}
        data={data}
        // rowsPerPage={3}
      />
    </section>
  );
}
