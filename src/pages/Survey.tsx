import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import valenzuelaSeal from "@/assets/valenzuela-seal.png";
import { Menu } from "lucide-react";
import { z } from "zod";

// Input validation schema
const surveySchema = z.object({
  clientType: z.string().min(1, "Client type is required").max(50),
  date: z.string().min(1, "Date is required"),
  sex: z.enum(["Male", "Female", "Prefer not to say"]),
  age: z.number().min(1, "Age must be at least 1").max(120, "Age must be at most 120").optional(),
  region: z.string().max(100).optional(),
  serviceAvailed: z.string().min(1, "Service availed is required").max(200),
  cc1: z.enum(["Yes", "No"]).optional(),
  cc2: z.enum(["Easy to see", "Somewhat easy", "Difficult", "N/A"]).optional(),
  cc3: z.enum(["Yes", "No", "N/A"]).optional(),
  sqd0: z.number().min(1).max(5).optional(),
  sqd1: z.number().min(1).max(5).optional(),
  sqd2: z.number().min(1).max(5).optional(),
  sqd3: z.number().min(1).max(5).optional(),
  sqd4: z.number().min(1).max(5).optional(),
  sqd5: z.number().min(1).max(5).optional(),
  sqd6: z.number().min(1).max(5).optional(),
  sqd7: z.number().min(1).max(5).optional(),
  sqd8: z.number().min(1).max(5).optional(),
  suggestions: z.string().max(2000, "Suggestions must be at most 2000 characters").optional(),
  email: z.string().email("Invalid email format").max(255).optional().or(z.literal("")),
});

const services = [
  "Business Permit & Business Registration",
  "Business Permit Renewal",
  "Building Permit",
  "Electrical Permit / Electrical Inspection (e-CFEI)",
  "Occupancy Permit",
  "Barangay Clearance (via barangays but processed for city requirements)",
  "Zoning / Land Use Clearance",
  "Fire Safety Inspection Certificate (coordinate with BFP)",
  "Sanitary Permit",
  "Birth Certificate Registration",
  "Marriage Certificate Registration",
  "Death Certificate Registration",
  "Marriage License Application",
  "Correction/Annotation of Civil Registry Records",
  "Late Registration of Civil Records",
  "Certified True Copy of Civil Registry Documents",
  "Real Property Tax Payment",
  "Real Property Tax Clearance",
  "Business Tax Assessment & Payment",
  "Transfer of Tax Declaration",
  "Tax Mapping & Property Classification",
  "Health Center Consultation (General)",
  "Medical Assistance Programs",
  "Laboratory / Diagnostic Requests (for eligible residents)",
  "Vaccination Programs",
  "Dental Services (preventive & basic procedures)",
  "Hospital/Medical Referral Assistance",
  "Solo Parent ID Issuance",
  "PWD ID Application",
  "Senior Citizen ID Registration",
  "Financial Assistance / Medical, Burial, Emergency Aid",
  "Scholarship / Educational Assistance Program",
  "Feeding & Nutrition Support (for children)",
  "Social Case Handling & Welfare Programs",
  "Community Tax Certificate (Cedula)",
  "Certificate of Residency (via barangay but City recognized)",
  "Certificate of Indigency",
  "Certificate of No Marriage (CENOMAR — requested via PSA but assisted locally)",
  "Land Titling Assistance (selected programs)",
  "Socialized Housing Application",
  "Relocation Assistance (when applicable)",
  "Housing Verification & Documentation Requests",
  "Construction Approval & Inspection",
  "Excavation Permit",
  "Road Construction/Repair Requests",
  "Drainage & Public Works Requests",
  "Garbage / Waste Collection Requests",
  "Environmental Compliance & Waste Management Clearances",
  "Tree Cutting Permit / Urban Greening Programs",
];

const regions = [
  "Region I – Ilocos Region",
  "Region II – Cagayan Valley",
  "Region III – Central Luzon",
  "Region IV‑A – CALABARZON",
  "MIMAROPA Region",
  "Region V – Bicol Region",
  "Region VI – Western Visayas",
  "Region VII – Central Visayas",
  "Region VIII – Eastern Visayas",
  "Region IX – Zamboanga Peninsula",
  "Region X – Northern Mindanao",
  "Region XI – Davao Region",
  "Region XII – SOCCSKSARGEN",
  "Region XIII – Caraga",
  "NCR – National Capital Region",
  "CAR – Cordillera Administrative Region",
  "BARMM – Bangsamoro Autonomous Region in Muslim Mindanao",
  "NIR – Negros Island Region",
];

const Survey = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientType: "",
    date: new Date().toISOString().split('T')[0],
    sex: "",
    age: "",
    region: "",
    serviceAvailed: "",
    cc1: "",
    cc2: "",
    cc3: "",
    sqd0: "",
    sqd1: "",
    sqd2: "",
    sqd3: "",
    sqd4: "",
    sqd5: "",
    sqd6: "",
    sqd7: "",
    sqd8: "",
    suggestions: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Build validated data object conditionally for optional sqd fields
      const validatedData: any = {
        clientType: formData.clientType,
        date: formData.date,
        sex: formData.sex === "male" ? "Male" : formData.sex === "female" ? "Female" : "Prefer not to say",
        serviceAvailed: formData.serviceAvailed,
      };

      // Add optional fields
      if (formData.age) validatedData.age = parseInt(formData.age);
      if (formData.region) validatedData.region = formData.region;
      if (formData.cc1 === "1" || formData.cc1 === "4") validatedData.cc1 = formData.cc1 === "1" ? "Yes" : "No";
      if (formData.cc2 && formData.cc2 !== "5") validatedData.cc2 = formData.cc2 === "1" ? "Easy to see" : formData.cc2 === "2" ? "Somewhat easy" : formData.cc2 === "3" ? "Difficult" : "Not visible at all";
      if (formData.cc2 === "5") validatedData.cc2 = "N/A";
      if (formData.cc3 && formData.cc3 !== "4") validatedData.cc3 = formData.cc3 === "1" || formData.cc3 === "2" ? "Yes" : "No";
      if (formData.cc3 === "4") validatedData.cc3 = "N/A";

      // Add sqd fields only if they have valid values (not "na")
      if (formData.sqd0 && formData.sqd0 !== "na") validatedData.sqd0 = parseInt(formData.sqd0);
      if (formData.sqd1 && formData.sqd1 !== "na") validatedData.sqd1 = parseInt(formData.sqd1);
      if (formData.sqd2 && formData.sqd2 !== "na") validatedData.sqd2 = parseInt(formData.sqd2);
      if (formData.sqd3 && formData.sqd3 !== "na") validatedData.sqd3 = parseInt(formData.sqd3);
      if (formData.sqd4 && formData.sqd4 !== "na") validatedData.sqd4 = parseInt(formData.sqd4);
      if (formData.sqd5 && formData.sqd5 !== "na") validatedData.sqd5 = parseInt(formData.sqd5);
      if (formData.sqd6 && formData.sqd6 !== "na") validatedData.sqd6 = parseInt(formData.sqd6);
      if (formData.sqd7 && formData.sqd7 !== "na") validatedData.sqd7 = parseInt(formData.sqd7);
      if (formData.sqd8 && formData.sqd8 !== "na") validatedData.sqd8 = parseInt(formData.sqd8);

      if (formData.suggestions) validatedData.suggestions = formData.suggestions;
      if (formData.email) validatedData.email = formData.email;

      // Validate form data
      surveySchema.parse(validatedData);

      // Insert to database
      const { error } = await supabase.from('survey_responses').insert({
        client_type: validatedData.clientType,
        date_of_transaction: validatedData.date,
        sex: validatedData.sex,
        age: validatedData.age,
        region: validatedData.region,
        service_availed: validatedData.serviceAvailed,
        cc1: validatedData.cc1,
        cc2: validatedData.cc2,
        cc3: validatedData.cc3,
        sqd0: validatedData.sqd0,
        sqd1: validatedData.sqd1,
        sqd2: validatedData.sqd2,
        sqd3: validatedData.sqd3,
        sqd4: validatedData.sqd4,
        sqd5: validatedData.sqd5,
        sqd6: validatedData.sqd6,
        sqd7: validatedData.sqd7,
        sqd8: validatedData.sqd8,
        suggestions: validatedData.suggestions,
        email: validatedData.email,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your survey response has been submitted.",
      });

      navigate('/thank-you');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to submit survey. Please try again.",
        });
      }
    }
  };

  const getColorClasses = (colorKey: string, isSelected: boolean) => {
    if (!isSelected) return 'bg-muted/50 border-border hover:border-muted-foreground';
    
    switch (colorKey) {
      case "1":
        return 'bg-rating-1 border-rating-1 shadow-lg';
      case "2":
        return 'bg-rating-2 border-rating-2 shadow-lg';
      case "3":
        return 'bg-rating-3 border-rating-3 shadow-lg';
      case "4":
        return 'bg-rating-4 border-rating-4 shadow-lg';
      case "5":
        return 'bg-rating-5 border-rating-5 shadow-lg';
      default:
        return 'bg-muted border-muted shadow-lg';
    }
  };

  const RatingScale = ({ name, value, onChange }: { name: string; value: string; onChange: (value: string) => void }) => (
    <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 justify-items-center">
      {[
        { value: "1", label: "Strongly Disagree", emoji: "😞" },
        { value: "2", label: "Disagree", emoji: "🙁" },
        { value: "3", label: "Neither Agree nor Disagree", emoji: "😐" },
        { value: "4", label: "Agree", emoji: "🙂" },
        { value: "5", label: "Strongly Agree", emoji: "😊" },
        { value: "na", label: "N/A", emoji: "😶" },
      ].map((option) => {
        const isSelected = value === option.value;
        return (
          <div key={option.value} className="flex flex-col items-center gap-2 min-w-0">
            <Label
              htmlFor={`${name}-${option.value}`}
              className={`cursor-pointer transition-all duration-200 ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl border-2 transition-all duration-200 ${getColorClasses(option.value, isSelected)}`}>
                {option.emoji}
              </div>
              <RadioGroupItem
                value={option.value}
                id={`${name}-${option.value}`}
                className="sr-only"
              />
            </Label>
            <span className={`text-xs text-center leading-tight px-1 ${isSelected ? 'font-semibold' : 'text-muted-foreground'}`}>
              {option.label}
            </span>
          </div>
        );
      })}
    </RadioGroup>
  );

  const RectangularChoice = ({ name, value, onChange, options }: { name: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) => (
    <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-1 gap-3">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <div key={option.value} className="flex items-center gap-3">
            <Label
              htmlFor={`${name}-${option.value}`}
              className={`cursor-pointer transition-all duration-100 ease-out flex-1 p-4 rounded-lg border-2 text-left ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]'
                  : 'bg-background border-border hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02]'
              }`}
            >
              <RadioGroupItem
                value={option.value}
                id={`${name}-${option.value}`}
                className="sr-only"
              />
              <span className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                {option.label}
              </span>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            navigate('/');
            setSidebarOpen(false);
          }}
          className="w-full justify-start mb-4 hover:bg-muted/70 transition-all"
        >
          ← Back to Home
        </Button>
        
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-foreground">Survey Navigation</h3>
          <p className="text-xs text-muted-foreground">Jump to any section</p>
        </div>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {[
          { id: "client-info", label: "Client Information", icon: "👤", description: "Personal details" },
          { id: "citizens-charter", label: "Citizen's Charter", icon: "📋", description: "Awareness questions" },
          { id: "service-quality", label: "Service Quality", icon: "⭐", description: "Rate our service" },
          { id: "additional-feedback", label: "Additional Feedback", icon: "💬", description: "Comments & suggestions" },
        ].map((section, index) => (
          <button
            key={section.id}
            onClick={() => {
              const element = document.getElementById(section.id);
              element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setSidebarOpen(false);
            }}
            className="w-full text-left px-4 py-4 rounded-lg hover:bg-primary/10 transition-all duration-200 flex items-start gap-3 group border border-transparent hover:border-primary/20 hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl group-hover:scale-110 transition-transform flex-shrink-0">
              {section.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-foreground mb-0.5 group-hover:text-primary transition-colors">
                {section.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {section.description}
              </div>
            </div>
            <div className="text-muted-foreground text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {String(index + 1).padStart(2, '0')}
            </div>
          </button>
        ))}
      </div>

      {/* Progress Footer */}
      <div className="p-6 border-t border-border/50 bg-gradient-to-t from-muted/30 to-transparent">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-foreground">Completion</h4>
            <span className="text-xs font-medium text-primary">
              {Math.round((Object.values(formData).filter(v => v !== "").length / Object.keys(formData).length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${(Object.values(formData).filter(v => v !== "").length / Object.keys(formData).length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {Object.values(formData).filter(v => v !== "").length} of {Object.keys(formData).length} fields completed
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex relative bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Mobile Sidebar Trigger */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:block w-72 bg-card border-r border-border/50 fixed left-0 top-0 h-screen overflow-hidden shadow-xl z-40">
        <SidebarContent />
      </div>
      
      {/* Main Content - with left margin to account for fixed sidebar */}
      <div className="lg:ml-72 py-4 px-2 sm:py-8 sm:px-4 overflow-y-auto">
        <div className="w-full relative z-10">
        <Card className="shadow-2xl backdrop-blur-sm bg-card/95 border-2 border-primary/20 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
            <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <img src={valenzuelaSeal} alt="City of Valenzuela Seal" className="w-16 h-16 flex-shrink-0" />
              <div className="text-center sm:text-left">
                <CardTitle className="text-xl sm:text-2xl font-bold leading-tight">CITY GOVERNMENT OF VALENZUELA</CardTitle>
                <CardDescription className="text-primary-foreground/90 text-sm sm:text-base">HELP US SERVE YOU BETTER!</CardDescription>
              </div>
            </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 bg-gradient-to-b from-background to-muted/20">
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-foreground">
                This Client Satisfaction Measurement (CSM) tracks the customer experience of government offices. Your feedback
                on your <strong>recently concluded transaction</strong> will help this office provide a better service. Personal information shared will
                be kept confidential and you always have the option to not answer this form.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Demographics Section */}
              <Card id="client-info" className="scroll-mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Client Type *</Label>
                    <RadioGroup value={formData.clientType} onValueChange={(value) => setFormData({...formData, clientType: value})}>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="citizen" id="citizen" />
                          <Label htmlFor="citizen">Citizen</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="business" id="business" />
                          <Label htmlFor="business">Business</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="government" id="government" />
                          <Label htmlFor="government">Government</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full max-w-[180px]"
                      />
                    </div>
                    <div>
                      <Label>Sex *</Label>
                      <RadioGroup value={formData.sex} onValueChange={(value) => setFormData({...formData, sex: value})}>
                        <div className="flex gap-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Age"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="region">Region of Residence</Label>
                      <Select value={formData.region} onValueChange={(value) => setFormData({...formData, region: value})}>
                        <SelectTrigger id="region" className="w-full">
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] sm:max-h-[300px] min-w-[var(--radix-select-trigger-width)] max-w-[250px] z-50 relative overflow-y-auto">
                          {regions.map((region) => (
                            <SelectItem key={region} value={region} className="text-sm sm:text-base">
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="service">Service Availed *</Label>
                      <Select value={formData.serviceAvailed} onValueChange={(value) => setFormData({...formData, serviceAvailed: value})}>
                        <SelectTrigger id="service" className="w-full">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] sm:max-h-[300px] min-w-[var(--radix-select-trigger-width)] max-w-[250px] z-50 relative overflow-y-auto">
                          <SelectItem value="licensing-permits-header" disabled className="font-semibold text-primary text-sm sm:text-base">
                            Licensing & Permits
                          </SelectItem>
                          {services.slice(0, 9).map((service) => (
                            <SelectItem key={service} value={service} className="text-sm sm:text-base">
                              {service}
                            </SelectItem>
                          ))}

                          <SelectItem value="civil-registry-header" disabled className="font-semibold text-primary mt-2 text-sm sm:text-base">
                            Civil Registry Services
                          </SelectItem>
                          {services.slice(9, 16).map((service) => (
                            <SelectItem key={service} value={service} className="text-sm sm:text-base">
                              {service}
                            </SelectItem>
                          ))}

                          <SelectItem value="tax-revenue-header" disabled className="font-semibold text-primary mt-2 text-sm sm:text-base">
                            Tax & Revenue Services
                          </SelectItem>
                          {services.slice(16, 21).map((service) => (
                            <SelectItem key={service} value={service} className="text-sm sm:text-base">
                              {service}
                            </SelectItem>
                          ))}

                          <SelectItem value="health-header" disabled className="font-semibold text-primary mt-2 text-sm sm:text-base">
                            Health-Related Services
                          </SelectItem>
                          {services.slice(21, 27).map((service) => (
                            <SelectItem key={service} value={service} className="text-sm sm:text-base">
                              {service}
                            </SelectItem>
                          ))}

                          <SelectItem value="social-header" disabled className="font-semibold text-primary mt-2 text-sm sm:text-base">
                            Social Services
                          </SelectItem>
                          {services.slice(27, 34).map((service) => (
                            <SelectItem key={service} value={service} className="text-sm sm:text-base">
                              {service}
                            </SelectItem>
                          ))}

                          <SelectItem value="id-cert-header" disabled className="font-semibold text-primary mt-2 text-sm sm:text-base">
                            ID & Certification Issuance
                          </SelectItem>
                          {services.slice(34, 38).map((service) => (
                            <SelectItem key={service} value={service} className="text-sm sm:text-base">
                              {service}
                            </SelectItem>
                          ))}

                          <SelectItem value="housing-header" disabled className="font-semibold text-primary mt-2 text-sm sm:text-base">
                            Housing & Land Services
                          </SelectItem>
                          {services.slice(38, 42).map((service) => (
                            <SelectItem key={service} value={service} className="text-sm sm:text-base">
                              {service}
                            </SelectItem>
                          ))}

                          <SelectItem value="infrastructure-header" disabled className="font-semibold text-primary mt-2 text-sm sm:text-base">
                            Infrastructure & Engineering Services
                          </SelectItem>
                          {services.slice(42, 46).map((service) => (
                            <SelectItem key={service} value={service} className="text-sm sm:text-base">
                              {service}
                            </SelectItem>
                          ))}

                          <SelectItem value="environmental-header" disabled className="font-semibold text-primary mt-2 text-sm sm:text-base">
                            Environmental Services
                          </SelectItem>
                          {services.slice(46).map((service) => (
                            <SelectItem key={service} value={service} className="text-sm sm:text-base">
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Citizen's Charter Section */}
              <Card id="citizens-charter" className="scroll-mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Citizen's Charter (CC) Awareness</CardTitle>
                  <CardDescription className="mt-2">
                    The Citizen's Charter is an official document that describes the services provided by this office, 
                    including requirements, fees, processing times, and procedures. It serves as a guide to help you 
                    understand what to expect from our services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-semibold">CC1: Which of the following best describes your awareness of a CC? *</Label>
                    <RectangularChoice
                      name="cc1"
                      value={formData.cc1}
                      onChange={(value) => setFormData({...formData, cc1: value})}
                      options={[
                        { value: "1", label: "I know what a CC is and I saw this office's CC" },
                        { value: "2", label: "I know what a CC is but I did NOT see this office's CC" },
                        { value: "3", label: "I learned of the CC only when I saw this office's CC" },
                        { value: "4", label: "I do not know what a CC is and I did not see one in this office" },
                      ]}
                    />
                  </div>

                  {formData.cc1 !== "4" && (
                    <>
                      <div>
                        <Label className="font-semibold">CC2: If aware of CC, would you say that the CC of this office was...?</Label>
                        <RectangularChoice
                          name="cc2"
                          value={formData.cc2}
                          onChange={(value) => setFormData({...formData, cc2: value})}
                          options={[
                            { value: "1", label: "Easy to see" },
                            { value: "2", label: "Somewhat easy to see" },
                            { value: "3", label: "Difficult to see" },
                            { value: "4", label: "Not visible at all" },
                            { value: "5", label: "Not Applicable" },
                          ]}
                        />
                      </div>

                      <div>
                        <Label className="font-semibold">CC3: How much did the CC help you in your transaction?</Label>
                        <RectangularChoice
                          name="cc3"
                          value={formData.cc3}
                          onChange={(value) => setFormData({...formData, cc3: value})}
                          options={[
                            { value: "1", label: "Helped very much" },
                            { value: "2", label: "Somewhat helped" },
                            { value: "3", label: "Did not help" },
                            { value: "4", label: "Not Applicable" },
                          ]}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Service Quality Dimensions */}
              <Card id="service-quality" className="scroll-mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Service Quality Assessment</CardTitle>
                  <CardDescription>Please rate your agreement with each statement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { key: "sqd0", label: "I am satisfied with the service that I availed" },
                    { key: "sqd1", label: "I spent a reasonable amount of time for my transaction" },
                    { key: "sqd2", label: "The office followed the transaction's requirements and steps based on the information provided" },
                    { key: "sqd3", label: "The steps (including payment) I needed to do for my transaction were easy and simple" },
                    { key: "sqd4", label: "I easily found information about my transaction from the office or its website" },
                    { key: "sqd5", label: "I paid a reasonable amount of fees for my transaction" },
                    { key: "sqd6", label: "I feel the office was fair to everyone, or 'walang palakasan', during my transaction" },
                    { key: "sqd7", label: "I was treated courteously by the staff, and (if asked for help) the staff was helpful" },
                    { key: "sqd8", label: "I got what I needed from the government office, or (if denied) denial of request was sufficiently explained to me" },
                  ].map((question, index) => (
                    <div key={question.key} className="space-y-3 pb-4 border-b border-border last:border-0">
                      <Label className="font-semibold">SQD{index}: {question.label} *</Label>
                      <RatingScale
                        name={question.key}
                        value={formData[question.key as keyof typeof formData] as string}
                        onChange={(value) => setFormData({...formData, [question.key]: value})}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Suggestions & Email */}
              <Card id="additional-feedback" className="scroll-mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Additional Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="suggestions">Suggestions on how we can further improve our services (optional)</Label>
                    <Textarea
                      id="suggestions"
                      placeholder="Your suggestions..."
                      maxLength={2000}
                      value={formData.suggestions}
                      onChange={(e) => setFormData({...formData, suggestions: e.target.value})}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{formData.suggestions.length}/2000 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="email">Email address (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      maxLength={255}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button type="button" variant="outline" size="lg" onClick={() => navigate('/')} className="lg:hidden w-full sm:w-auto">
                  Back to Home
                </Button>
                <Button type="submit" size="lg" className="w-full sm:w-auto px-8 sm:px-12">
                  Submit Survey
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Survey;
