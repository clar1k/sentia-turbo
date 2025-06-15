import { TransactionCard, type TransactionData } from "./TransactionCard"; // Adjust path

interface InlineRouterProps {
  message: string;
}

const tagRegex = /(<tx>[\s\S]*?<\/tx>)/i;

function extractTagContent(xml: string, tag: string): string | null {
  const pattern = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xml.match(pattern);
  return match ? match[1].trim() : null;
}

export function InlineRouter({ message }: InlineRouterProps) {
  const parts = message.split(tagRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (tagRegex.test(part)) {
          const txDataString = extractTagContent(part, "tx");
          if (txDataString) {
            try {
              console.log(txDataString);
              const txData: TransactionData = JSON.parse(txDataString);
              if (!txData || Object.keys(txData).length == 0) {
                throw new Error("Failed to parse txData");
              }
              return <TransactionCard key={index} txData={txData} />;
            } catch (error) {
              console.error("Failed to parse transaction JSON:", error);
              return (
                <span key={index} className="text-red-500">
                  [Invalid Transaction Data]
                </span>
              );
            }
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}