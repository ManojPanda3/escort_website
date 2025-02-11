// import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [open, setOpen] = useState(false);
  // const router = useRouter();
  // const currentDate = new Date().toLocaleDateString("en-US", {
  //   month: "long",
  //   day: "numeric",
  //   year: "numeric",
  // });
  //
  // useEffect(() => {
  //   // Check if user has already verified
  //   const hasVerified = localStorage.getItem("age-verified");
  //   if (!hasVerified) {
  //     setOpen(true);
  //   }
  // }, []);
  //
  // const handleAgree = () => {
  //   localStorage.setItem("age-verified", "true");
  //   setOpen(false);
  // };
  //
  // const handleDisagree = () => {
  //   // Redirect to a safe page or show a message
  //   router.push("https://www.google.com");
  // };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {/* {/* Age Verification Dialog */} */}
          {/* <Dialog open={open} onOpenChange={setOpen} modal={true}> */}
          {/*   <DialogContent className="sm:max-w-[500px]"> */}
          {/*     <DialogHeader> */}
          {/*       <DialogTitle className="text-2xl font-bold tracking-tight text-center"> */}
          {/*         CONTENT FOR OVER 18+ ONLY */}
          {/*       </DialogTitle> */}
          {/*       <DialogDescription className="text-center"> */}
          {/*         This Website is for use solely by individuals who are at least */}
          {/*         18 years old and have reached the age of majority. */}
          {/*       </DialogDescription> */}
          {/*     </DialogHeader> */}
          {/*     <div className="space-y-4 py-4 text-sm"> */}
          {/*       <p> */}
          {/*         BY CLICKING "I AGREE" BELOW, YOU STATE THAT THE FOLLOWING */}
          {/*         STATEMENTS ARE ACCURATE: */}
          {/*       </p> */}
          {/*       <ul className="list-disc pl-6 space-y-2"> */}
          {/*         <li> */}
          {/*           You are at least 18 years old and the age of majority or age */}
          {/*           of consent in your jurisdiction. */}
          {/*         </li> */}
          {/*         <li> */}
          {/*           You will promptly leave this Website if you are offended by */}
          {/*           its content. */}
          {/*         </li> */}
          {/*         <li> */}
          {/*           You will not hold the Website's owners or its employees */}
          {/*           responsible for any materials located on the Website. */}
          {/*         </li> */}
          {/*       </ul> */}
          {/*       <p className="text-muted-foreground text-xs"> */}
          {/*         Date: {currentDate} */}
          {/*       </p> */}
          {/*     </div> */}
          {/*     <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center sm:space-x-4"> */}
          {/*       <Button */}
          {/*         type="button" */}
          {/*         variant="default" */}
          {/*         className="w-full sm:w-auto bg-green-600 hover:bg-green-700" */}
          {/*         onClick={handleAgree} */}
          {/*       > */}
          {/*         I AGREE - ENTER */}
          {/*       </Button> */}
          {/*       <Button */}
          {/*         type="button" */}
          {/*         variant="outline" */}
          {/*         className="w-full sm:w-auto border-gray-600" */}
          {/*         onClick={handleDisagree} */}
          {/*       > */}
          {/*         I DISAGREE */}
          {/*       </Button> */}
          {/*     </DialogFooter> */}
          {/*   </DialogContent> */}
          {/* </Dialog> */}
          {/**/}
          {/* Children component */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
