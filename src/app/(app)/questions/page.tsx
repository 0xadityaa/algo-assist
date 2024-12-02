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

const QuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/questions");
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
          (error as Error)?.message ||
            "An error occurred while fetching questions."
        );
      }
    };

    fetchQuestions();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!questions) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Questions</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Topics</TableHead>
            <TableHead>Companies</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.title}</TableCell>
              <TableCell>{question.difficulty}</TableCell>
              <TableCell>{(question.topics?.map((topic) => 
                typeof topic === 'object' && topic !== null ? topic.name : ''
              ))}</TableCell>
              <TableCell>{(question.companies?.map((company) => 
                typeof company === 'object' && company !== null ? company.name : ''
              ))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuestionsPage;
