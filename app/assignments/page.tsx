import { AssignmentsList } from "@/components/assignments-list";

export default function AssignmentsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Assignments</h1>
      <AssignmentsList />
    </div>
  );
}