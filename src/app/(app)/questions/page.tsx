"use client";
import type { Question } from "@/payload-types";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/questions?populate=topics.name,companies.name,author.name&depth=3");
        if (response.ok) {
          const fetchedQuestions = await response.json();
          console.log("API Response:", fetchedQuestions);
          setQuestions(fetchedQuestions.docs as Question[]);
        } else {
          const errorMessage = await response.text();
          console.error("Error fetching questions:", errorMessage);
          setError(
            errorMessage || "An error occurred while fetching questions."
          );
        }
      } catch (error: unknown) {
        console.error("Error fetching questions:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching questions."
        );
      }
    };

    fetchQuestions();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!questions) {
    return <Loading text="Loading Questions..." />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Questions</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id} onClick={() => {router.push(`/questions/${question.id}`)}}>
              <TableCell>{question.title}</TableCell>
              <TableCell>{question.difficulty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuestionsPage;
