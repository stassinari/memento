import { createFileRoute } from "@tanstack/react-router";
import { getGenerativeModel, Schema } from "firebase/vertexai";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { Heading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Textarea } from "~/components/Textarea";
import { BeansCard } from "~/components/beans/BeansCard";
import sampleText from "~/data/beans-page-example.txt?raw";
import { BeanOrigin, RoastStyle } from "~/db/schema";
import { Beans } from "~/db/types";
import { vertex } from "~/firebaseConfig";

export const Route = createFileRoute("/_auth/_layout/ai")({
  component: AiPlayground,
});

const beansSchema = Schema.object({
  properties: {
    name: Schema.string({
      description:
        "The name that the roaster gave to the beans. It usually includes the farm/place where the beans are from.",
      example: "Hacienda La Papaya",
    }),
    roaster: Schema.string({
      description: "The name of the roaster. This is usually the company that roasted the beans.",
      example: "La Cabra",
    }),

    roastDate: Schema.number({
      description: "The date the beans were roasted on. The format is a unix timestamp in seconds.",
      example: 1746805164,
      nullable: true,
      default: null,
    }),

    roastStyle: Schema.enumString({
      enum: ["filter", "espresso", "omni-roast"],
      description:
        "The roast style of the beans. If it usually is clearly stated if it's a filter or espresso roast. The words 'filter' or 'espresso' are usually somewhere in the description.",
      example: "espresso",
      //   nullable: true,
    }),
    roastLevel: Schema.number({
      description:
        "The roast level of the beans, expressed as an integer number between 0 and 4, where 0 is very light and 4 is very dark. Sometimes it will be expressed as a word (light, medium, dark).",
      example: 1,
      //   nullable: true,
      //   default: null,
    }),
    roastingNotes: Schema.array({
      items: Schema.string({
        description:
          "A single tasting note of the beans. Usually the name of a fruit or food (apricot, marzipan), sometimes just a taste descriptor (sweet). Use one or two words. Capitalise only the first letter of the first word.",
        example: "Peach",
      }),
      description:
        "The tasting notes of the beans. This is usually a list of words that describe the beans. Use as many items as you see fit.",
      example: ["Chocolate", "Caramel", "Fruity"],
      default: [],
    }),
    country: Schema.string({
      description: "The country where the beans were grown.",
      example: "Ethiopia",
      //   nullable: true,
    }),
    region: Schema.string({
      description: "The region within the country where the beans were grown.",
      example: "Yirgacheffe",
      //   nullable: true,
    }),
    varietals: Schema.array({
      items: Schema.string({
        description: "The varietals of the coffee beans.",
        example: "Heirloom",
      }),
      description: "A list of varietals for the beans.",
      example: ["Heirloom", "Bourbon"],
    }),
    altitude: Schema.number({
      description: "The altitude at which the beans were grown, in meters.",
      example: 2000,
      nullable: true,
    }),
    process: Schema.string({
      description: "The process used to prepare the beans (e.g., washed, natural).",
      example: "Washed",
      //   nullable: true,
    }),
    farmer: Schema.string({
      description: "The name of the farmer or producer of the beans.",
      example: "Tesfaye Bekele",
      nullable: true,
    }),
    harvestDate: Schema.string({
      description: "The month and year the beans were harvested.",
      format: "MMM YYYY",
      example: "Jan 2023",
      nullable: true,
    }),
  },
});

function parseBeansSingleOrigin(json: any): Beans | null {
  try {
    // Basic type checks for required fields
    if (
      typeof json.name !== "string" ||
      typeof json.roaster !== "string" ||
      typeof json.roastStyle !== "string" ||
      typeof json.roastLevel !== "number" ||
      !Array.isArray(json.roastingNotes) ||
      typeof json.country !== "string" ||
      !Array.isArray(json.varietals) ||
      typeof json.process !== "string"
    ) {
      return null;
    }

    // Optional fields with safe parsing
    const roastDate = typeof json.roastDate === "number" ? new Date(json.roastDate * 1000) : null;

    const harvestDate = typeof json.harvestDate === "string" ? new Date(json.harvestDate) : null;

    return {
      id: "generated",
      origin: BeanOrigin.SingleOrigin,
      name: json.name,
      roaster: json.roaster,
      roastDate,
      roastStyle: json.roastStyle as RoastStyle,
      roastLevel: json.roastLevel,
      roastingNotes: json.roastingNotes,
      country: json.country,
      varietals: json.varietals,
      altitude: typeof json.altitude === "number" ? json.altitude : null,
      process: json.process,
      farmer: typeof json.farmer === "string" ? json.farmer : null,
      harvestDate,
      region: typeof json.region === "string" ? json.region : null,
      freezeDate: null,
      thawDate: null,
    } as Beans;
  } catch {
    return null;
  }
}

function AiPlayground() {
  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings]} />
      <Heading>AI playground</Heading>
      <p className="mt-4">Let's create some magic here ✨</p>

      <div className="space-y-8">
        <TextGeneration />
        <ImageDescription />
        <StructuredOutputText />
        <StructuredOutputWeb />
        <StructuredOutputImage />
      </div>
    </>
  );
}

const TextGeneration = () => {
  const textGenerationModel = getGenerativeModel(vertex, {
    model: "gemini-2.0-flash",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [textGenerationOutput, setTextGenerationOutput] = useState<string>();

  const generateStory = async () => {
    setIsLoading(true);
    try {
      const prompt = "Write a very short story about a coffee.";
      const result = await textGenerationModel.generateContent(prompt);
      const response = result.response;
      setTextGenerationOutput(response.text());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-md font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
        Text generation
      </h2>
      <Button onClick={generateStory} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate a story about coffee"}
      </Button>
      {textGenerationOutput && (
        <div className="mt-4 p-4 bg-gray-100 rounded prose-sm">
          <ReactMarkdown>{textGenerationOutput}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

const StructuredOutputText = () => {
  // Initialize the generative model.
  const model = getGenerativeModel(vertex, {
    model: "gemini-2.0-flash",
    // In the generation config, set the `responseMimeType` to `application/json`
    // and pass the JSON schema object into `responseSchema`.
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: beansSchema,
    },
  });

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [structuredOutput, setStructuredOutput] = useState<string>();

  const prompt = `
  You are a helpful assistant for the coffee companion app Memento Coffee. 
  Please extract the information about the coffee beans from the text below.
  
  ${text}`;

  const generateStructuredOutput = async () => {
    setIsLoading(true);
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      setStructuredOutput(JSON.parse(response.text()));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-md font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
          Structured outputs: text
        </h2>

        <Button variant="secondary" size="sm" onClick={() => setText(sampleText)}>
          Sample text
        </Button>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to extract structured output from"
        className="mt-4 p-2 border border-gray-300 rounded"
        rows={10}
      />
      <Button onClick={generateStructuredOutput} disabled={isLoading}>
        {isLoading ? "Extracting..." : "Extracted structured output"}
      </Button>
      {structuredOutput && (
        <pre className="mt-4 p-4 bg-gray-100 rounded">
          {JSON.stringify(structuredOutput, null, 2)}
        </pre>
      )}
    </div>
  );
};

const StructuredOutputWeb = () => {
  // Initialize the generative model.
  const model = getGenerativeModel(vertex, {
    model: "gemini-2.0-flash",
    // In the generation config, set the `responseMimeType` to `application/json`
    // and pass the JSON schema object into `responseSchema`.
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: beansSchema,
    },
  });

  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [structuredOutput, setStructuredOutput] = useState<Beans>();

  const generateStructuredOutput = async () => {
    setIsLoading(true);
    try {
      const prompt = `
        You are a helpful assistant for the coffee companion app Memento Coffee. 
        Please extract the information about the coffee beans from the following website.
         
        ${url}`;

      const result = await model.generateContent(prompt);
      const response = result.response;

      const json = JSON.parse(response.text());
      const beans = parseBeansSingleOrigin(json);
      if (!beans) throw new Error("Invalid beans data");

      setStructuredOutput(beans);
    } catch {
      setStructuredOutput(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-md font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
        Structured outputs: web
      </h2>

      <div className="flex flex-col items-start gap-6">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a URL"
          className="mt-4 p-2 border border-gray-300 rounded"
        />
        <Button onClick={generateStructuredOutput} disabled={isLoading}>
          {isLoading ? "Extracting..." : "Extract structured output"}
        </Button>
        {structuredOutput && (
          <pre className="mt-4 p-4 bg-gray-100 rounded">
            {JSON.stringify(structuredOutput, null, 2)}
          </pre>
        )}

        {structuredOutput && <BeansCard beans={structuredOutput} />}
      </div>
    </div>
  );
};

// Converts a File object to a Part object.
interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

const fileToGenerativePart = async (file: File): Promise<GenerativePart> => {
  const base64EncodedDataPromise: Promise<string> = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const ImageDescription = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const generateOutput = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const prompt = "Could you describe the following image?";
      const imagePart = await fileToGenerativePart(file);

      const model = getGenerativeModel(vertex, {
        model: "gemini-2.0-flash",
      });

      console.log("imagePart", imagePart);

      const result = await model.generateContent([prompt, imagePart]);
      const response = result.response;
      setOutput(response.text());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-md font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
        Image: description
      </h2>

      <div className="flex flex-col items-start gap-6">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <Button onClick={generateOutput} disabled={isLoading || !file}>
          {isLoading ? "Generating..." : "Generate output"}
        </Button>
        {output && (
          <div className="mt-4 p-4 bg-gray-100 rounded prose-sm">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

const StructuredOutputImage = () => {
  // Initialize the generative model.
  const model = getGenerativeModel(vertex, {
    model: "gemini-2.0-flash",
    // In the generation config, set the `responseMimeType` to `application/json`
    // and pass the JSON schema object into `responseSchema`.
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: beansSchema,
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [structuredOutput, setStructuredOutput] = useState<Beans>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const generateStructuredOutput = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const imagePart = await fileToGenerativePart(file);

      const prompt = `
        You are a helpful assistant for the coffee companion app Memento Coffee. 
        Please extract the information about the coffee beans from the following image.`;
      const result = await model.generateContent([prompt, imagePart]);
      const response = result.response;

      const json = JSON.parse(response.text());
      const beans = parseBeansSingleOrigin(json);
      if (!beans) throw new Error("Invalid beans data");

      setStructuredOutput(beans);
    } catch {
      setStructuredOutput(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-md font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
        Structured outputs: image
      </h2>

      <div>
        <div className="flex flex-col items-start gap-6">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button onClick={generateStructuredOutput} disabled={isLoading || !file}>
            {isLoading ? "Generating..." : "Generate output"}
          </Button>
          {structuredOutput && (
            <pre className="mt-4 p-4 bg-gray-100 rounded">
              {JSON.stringify(structuredOutput, null, 2)}
            </pre>
          )}

          {structuredOutput && <BeansCard beans={structuredOutput} />}
        </div>
      </div>
    </div>
  );
};
