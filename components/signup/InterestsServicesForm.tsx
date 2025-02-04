import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx";

interface InterestsServicesFormProps {
  formData: {
    userType: string;
    interests: string[];
    services: string[];
  };
  updateFormData: (
    data: Partial<InterestsServicesFormProps["formData"]>,
  ) => void;
  onNext: () => void;
  onPrevious: () => void;
  setError: () => void;
}

export default function InterestsServicesForm({
  formData,
  updateFormData,
  onNext,
  onPrevious,
  setError,
}: InterestsServicesFormProps) {
  const [categoryChoise, setCategoriesChoise] = useState<string>("");
  const [serviceChoise, setServiceChoise] = useState<string>("");
  const [services, setServices] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const [fetchedService, fetchedCategories] = await Promise.all([
        fetch("/services.json"),
        fetch("/categories.json"),
      ]);
      console.log(fetchedService, fetchedCategories);
    })();
  });

  const addInterest = () => {
    if (categoryChoise && !formData.interests.includes(categoryChoise)) {
      updateFormData({ interests: [...formData.interests, categoryChoise] });
      setCategoriesChoise("");
    }
  };

  const removeInterest = (interest: string) => {
    updateFormData({
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  const addService = () => {
    if (serviceChoise && !formData.services.includes(serviceChoise)) {
      updateFormData({ services: [...formData.services, serviceChoise] });
      setServiceChoise("");
    }
  };

  const removeService = (service: string) => {
    updateFormData({
      services: formData.services.filter((s) => s !== service),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="space-y-2">
          <Label htmlFor="interest category">Interested Categories</Label>
          <Select
            value={categoryChoise}
            onValueChange={(value) => {
              setCategoriesChoise(value);
              addInterest(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select interested categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category, index) => (
                <SelectItem key={index + category || ""} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.interests.map((category) => (
              <Badge key={category} variant="secondary" className="px-2 py-1">
                {category}
                <button
                  type="button"
                  onClick={() =>
                    removeInterest(category)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* <Label htmlFor="interests">Interests</Label> */}
        {/* <div className="flex gap-2 mb-2"> */}
        {/*   <Input */}
        {/*     id="interests" */}
        {/*     value={categoryChoise} */}
        {/*     onChange={(e) => setCategoriesChoise(e.target.value)} */}
        {/*     placeholder="Add an interest" */}
        {/*   /> */}
        {/*   <Button onClick={addInterest} type="button"> */}
        {/*     Add */}
        {/*   </Button> */}
        {/* </div> */}
        {/* <div className="flex flex-wrap gap-2"> */}
        {/*   {formData.interests.map((interest) => ( */}
        {/*     <Badge key={interest} variant="secondary" className="px-2 py-1"> */}
        {/*       {interest} */}
        {/*       <button */}
        {/*         onClick={() => */}
        {/*           removeInterest(interest)} */}
        {/*         className="ml-2 text-red-500 hover:text-red-700" */}
        {/*       > */}
        {/*         <X className="h-3 w-3" /> */}
        {/*       </button> */}
        {/*     </Badge> */}
        {/*   ))} */}
        {/* </div> */}
      </div>

      {/* {formData.userType !== "general" && ( */}
      {/*   <div> */}
      {/*     <Label htmlFor="services">Services</Label> */}
      {/*     <div className="flex gap-2 mb-2"> */}
      {/*       <Input */}
      {/*         id="services" */}
      {/*         value={serviceChoise} */}
      {/*         onChange={(e) => setServiceChoise(e.target.value)} */}
      {/*         placeholder="Add a service" */}
      {/*       /> */}
      {/*       <Button onClick={addService} type="button"> */}
      {/*         Add */}
      {/*       </Button> */}
      {/*     </div> */}
      {/*     <div className="flex flex-wrap gap-2"> */}
      {/*       {formData.services.map((service) => ( */}
      {/*         <Badge key={service} variant="secondary" className="px-2 py-1"> */}
      {/*           {service} */}
      {/*           <button */}
      {/*             onClick={() => */}
      {/*               removeService(service)} */}
      {/*             className="ml-2 text-red-500 hover:text-red-700" */}
      {/*           > */}
      {/*             <X className="h-3 w-3" /> */}
      {/*           </button> */}
      {/*         </Badge> */}
      {/*       ))} */}
      {/*     </div> */}
      {/*   </div> */}
      {/* )} */}

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
