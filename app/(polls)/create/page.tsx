"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash } from "lucide-react";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  category: Yup.string()
    .oneOf(["General", "Technology", "Entertainment", "Health", "Sports"])
    .required("Category is required"),
  description: Yup.string().optional(),
  question: Yup.string()
    .trim()
    .min(5, "Question must be at least 5 characters")
    .required("Question is required"),
  options: Yup.array()
    .of(Yup.string().trim().required("Each option must have text"))
    .min(2, "At least 2 options are required"),
});

export default function CreatePoll() {
  const [pollCreated, setPollCreated] = useState(false);
  const [pollId, setPollId] = useState("");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "General",
      description: "",
      question: "",
      options: ["", ""], // Start with two empty options
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post("/api/polls/create", values);
        if (response.data.success) {
          setPollCreated(true);
          setPollId(response.data.pollId);
        }
      } catch (error) {
        console.error("Error creating poll:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const generateRandomName = () => {
    const names = ["PollMaster", "OpinionGuru", "VoteKing", "ChoiceMaker"];
    formik.setFieldValue(
      "name",
      names[Math.floor(Math.random() * names.length)]
    );
    formik.setFieldTouched("name", true, false);
  };

  const addOption = () => {
    formik.setFieldValue("options", [...formik.values.options, ""]);
  };

  const removeOption = (index: number) => {
    if (formik.values.options.length > 2) {
      const updatedOptions = formik.values.options.filter(
        (_, i) => i !== index
      );
      formik.setFieldValue("options", updatedOptions);
    }
  };

  if (pollCreated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center text-center p-6">
        <h2 className="text-3xl font-bold text-green-600">
          Poll Created Successfully!
        </h2>
        <p className="mt-2 text-gray-600">
          Your poll is live and ready to be shared.
        </p>
        <div className="mt-6 flex gap-4">
          <Button onClick={() => setPollCreated(false)}>
            Create More Polls
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/poll/${pollId}`)}
          >
            View Poll
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full max-w-lg p-6">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">Create a New Poll</h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="flex gap-2">
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your name"
                className="flex-grow"
              />
              <Button
                type="button"
                onClick={generateRandomName}
                variant="outline"
              >
                Random
              </Button>
            </div>
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}

            {/* Category Select */}
            <Select
              onValueChange={(value) => formik.setFieldValue("category", value)}
              defaultValue={formik.values.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
              </SelectContent>
            </Select>

            {/* Description (Optional) */}
            <Textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Poll description (optional)"
            />

            {/* Poll Question */}
            <Input
              name="question"
              value={formik.values.question}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter the poll question"
            />
            {formik.touched.question && formik.errors.question && (
              <p className="text-red-500 text-sm">{formik.errors.question}</p>
            )}

            {/* Poll Options */}
            <div className="space-y-2">
              {formik.values.options.map((option, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...formik.values.options];
                        updatedOptions[index] = e.target.value;
                        formik.setFieldValue("options", updatedOptions);
                      }}
                      onBlur={formik.handleBlur}
                      placeholder={`Option ${index + 1}`}
                      className="flex-grow"
                    />
                    {index >= 2 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {/* ✅ Display error messages for each option field */}
                  {formik.errors.options &&
                    formik.errors.options[index] &&
                    formik.touched.options && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.options[index]}
                      </p>
                    )}
                </div>
              ))}
            </div>

            {/* Add Option Button */}
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Option
            </Button>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Create Poll"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
