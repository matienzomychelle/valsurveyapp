import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SurveyResponse {
  id: string;
  client_type: string;
  date_of_transaction: string;
  sex: string | null;
  age: number | null;
  region: string | null;
  service_availed: string;
  cc1: string | null;
  cc2: string | null;
  cc3: string | null;
  sqd0: number | null;
  sqd1: number | null;
  sqd2: number | null;
  sqd3: number | null;
  sqd4: number | null;
  sqd5: number | null;
  sqd6: number | null;
  sqd7: number | null;
  sqd8: number | null;
  suggestions: string | null;
  email: string | null;
  created_at: string;
  survey_id: string | null;
  surveys?: {
    title: string;
    status: string;
  } | null;
}

const ResponseMonitoring = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Filter states
  const [surveyFilter, setSurveyFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");
  const [surveys, setSurveys] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [responses, surveyFilter, serviceFilter, dateFromFilter, dateToFilter]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch responses with survey information
    const { data: responsesData, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*, surveys(title, status)')
      .order('created_at', { ascending: false });

    if (responsesError) {
      toast({
        variant: "destructive",
        title: "Error fetching responses",
        description: responsesError.message,
      });
    } else {
      setResponses(responsesData || []);
    }

    // Fetch surveys for filter dropdown
    const { data: surveysData, error: surveysError } = await supabase
      .from('surveys')
      .select('id, title')
      .order('title');

    if (!surveysError && surveysData) {
      setSurveys(surveysData);
    }

    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...responses];

    // Survey filter
    if (surveyFilter !== "all") {
      filtered = filtered.filter(r => r.survey_id === surveyFilter);
    }

    // Service filter
    if (serviceFilter) {
      filtered = filtered.filter(r => 
        r.service_availed.toLowerCase().includes(serviceFilter.toLowerCase())
      );
    }

    // Date from filter
    if (dateFromFilter) {
      filtered = filtered.filter(r => 
        new Date(r.date_of_transaction) >= new Date(dateFromFilter)
      );
    }

    // Date to filter
    if (dateToFilter) {
      filtered = filtered.filter(r => 
        new Date(r.date_of_transaction) <= new Date(dateToFilter)
      );
    }

    setFilteredResponses(filtered);
  };

  const handleViewDetails = (response: SurveyResponse) => {
    setSelectedResponse(response);
    setIsDetailOpen(true);
  };

  const clearFilters = () => {
    setSurveyFilter("all");
    setServiceFilter("");
    setDateFromFilter("");
    setDateToFilter("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <CardDescription>Filter responses by survey, service, or date</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="survey-filter">Survey</Label>
              <Select value={surveyFilter} onValueChange={setSurveyFilter}>
                <SelectTrigger id="survey-filter">
                  <SelectValue placeholder="All surveys" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All surveys</SelectItem>
                  {surveys.map((survey) => (
                    <SelectItem key={survey.id} value={survey.id}>
                      {survey.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-filter">Service Office</Label>
              <Input
                id="service-filter"
                placeholder="Search service..."
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-from">Date From</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to">Date To</Label>
              <Input
                id="date-to"
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Responses</CardTitle>
          <CardDescription>
            Showing {filteredResponses.length} of {responses.length} responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Survey</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Client Type</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Satisfaction</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No responses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResponses.map((response) => (
                    <TableRow key={response.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        {new Date(response.date_of_transaction).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {response.surveys?.title || "N/A"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {response.service_availed}
                      </TableCell>
                      <TableCell>{response.client_type}</TableCell>
                      <TableCell>{response.region || "N/A"}</TableCell>
                      <TableCell>
                        {response.sqd0 ? (
                          <Badge variant={response.sqd0 >= 4 ? "default" : "secondary"}>
                            {response.sqd0}/5
                          </Badge>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(response)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedResponse && new Date(selectedResponse.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedResponse && (
            <div className="space-y-6">
              {/* Respondent Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Respondent Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Client Type</Label>
                    <p className="font-medium">{selectedResponse.client_type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Sex</Label>
                    <p className="font-medium">{selectedResponse.sex || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Age</Label>
                    <p className="font-medium">{selectedResponse.age || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Region</Label>
                    <p className="font-medium">{selectedResponse.region || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedResponse.email || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date of Transaction</Label>
                    <p className="font-medium">
                      {new Date(selectedResponse.date_of_transaction).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Survey Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Survey Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Survey</Label>
                    <p className="font-medium">{selectedResponse.surveys?.title || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Service Availed</Label>
                    <p className="font-medium">{selectedResponse.service_availed}</p>
                  </div>
                </div>
              </div>

              {/* Satisfaction Ratings */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Satisfaction Ratings</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                    const key = `sqd${index}` as keyof SurveyResponse;
                    const value = selectedResponse[key];
                    if (typeof value === 'number') {
                      return (
                        <div key={index}>
                          <Label className="text-muted-foreground">SQD {index}</Label>
                          <p className="font-medium">{value}/5</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Comments</h3>
                <div className="space-y-4">
                  {selectedResponse.cc1 && (
                    <div>
                      <Label className="text-muted-foreground">Comment 1</Label>
                      <p className="mt-1 p-3 bg-muted rounded-md">{selectedResponse.cc1}</p>
                    </div>
                  )}
                  {selectedResponse.cc2 && (
                    <div>
                      <Label className="text-muted-foreground">Comment 2</Label>
                      <p className="mt-1 p-3 bg-muted rounded-md">{selectedResponse.cc2}</p>
                    </div>
                  )}
                  {selectedResponse.cc3 && (
                    <div>
                      <Label className="text-muted-foreground">Comment 3</Label>
                      <p className="mt-1 p-3 bg-muted rounded-md">{selectedResponse.cc3}</p>
                    </div>
                  )}
                  {selectedResponse.suggestions && (
                    <div>
                      <Label className="text-muted-foreground">Suggestions</Label>
                      <p className="mt-1 p-3 bg-muted rounded-md">{selectedResponse.suggestions}</p>
                    </div>
                  )}
                  {!selectedResponse.cc1 && !selectedResponse.cc2 && !selectedResponse.cc3 && !selectedResponse.suggestions && (
                    <p className="text-muted-foreground">No comments provided</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResponseMonitoring;
