import { Button } from "@/components/Button";
import { vertex } from "@/firebaseConfig";
import { CameraIcon, LinkIcon } from "@heroicons/react/20/solid";
import { getGenerativeModel } from "firebase/vertexai";
import { useState } from "react";
import { Input } from "../Input";
import { beansVertexSchema, parseVertexBeansToBeansFormInput } from "./utils";

export interface BeansAiProps {
  onBeansParsed: (beans: any) => void;
}

export const BeansAi = ({ onBeansParsed }: BeansAiProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [openCameraImport, setOpenCameraImport] = useState(false);
  const [openLinkImport, setOpenLinkImport] = useState(false);

  const [url, setUrl] = useState("");

  const model = getGenerativeModel(vertex, {
    model: "gemini-2.0-flash",
    // In the generation config, set the `responseMimeType` to `application/json`
    // and pass the JSON schema object into `responseSchema`.
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: beansVertexSchema,
    },
  });

  const generateStructuredOutputFromLink = async () => {
    setIsLoading(true);
    try {
      const prompt = `
        You are a helpful assistant for the coffee companion app Memento Coffee. 
        Please extract the information about the coffee beans from the following website.
         
        ${url}`;

      const result = await model.generateContent(prompt);
      const response = result.response;

      const json = JSON.parse(response.text());

      const beans = parseVertexBeansToBeansFormInput(json);
      if (!beans) throw new Error("Invalid beans data");

      onBeansParsed(beans);

      setOpenLinkImport(false);
      setUrl("");
    } catch {
      //   setStructuredOutput(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center md:justify-between">
        <p className="text-sm text-gray-500">
          Use AI to quickly add the details of your beans ✨.
        </p>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="shrink-0"
            disabled
            onClick={() => {
              setOpenCameraImport(!openCameraImport);
              setOpenLinkImport(false);
            }}
          >
            <CameraIcon /> From a photo (Soon)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="shrink-0"
            onClick={() => {
              setOpenLinkImport(!openLinkImport);
              setOpenCameraImport(false);
            }}
          >
            <LinkIcon /> From a link
          </Button>
        </div>
      </div>

      {openCameraImport && (
        <div>
          <h3>Camera Import</h3>
          {/* Camera import logic goes here */}
        </div>
      )}

      {openLinkImport && (
        <div className="flex gap-4 items-center">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a URL"
            className="p-2 border border-gray-300 rounded"
          />

          <Button
            variant="primary"
            disabled={!url || isLoading}
            onClick={generateStructuredOutputFromLink}
          >
            {isLoading ? "Importing..." : "Import"}
          </Button>
        </div>
      )}
    </>
  );
};
