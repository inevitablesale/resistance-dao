import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { WalletConnectionOverlay } from "@/components/thesis/WalletConnectionOverlay";
import { createProposal } from "@/services/proposalContractService";

const SUBMISSION_FEE = ethers.utils.parseEther("250");

const ThesisSubmission = () => {
  const { isConnected } = useWalletConnection();
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    category: '',
    targetMarket: '',
    problemStatement: '',
    solutionOffered: '',
    revenueModel: '',
    requiredLGR: '',
    teamBackground: '',
    additionalInfo: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const requiredLGR = ethers.utils.parseEther(formData.requiredLGR);
      const proposalData = {
        ...formData,
        requiredLGR
      };
      await createProposal(proposalData);
      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been submitted for review.",
      });
      navigate('/proposals');
    } catch (error: any) {
      console.error("Error submitting proposal:", error);
      toast({
        title: "Error Submitting Proposal",
        description: error.message || "Failed to submit proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {!isConnected && <WalletConnectionOverlay requiredAmount={SUBMISSION_FEE} />}

      <div className="container mx-auto py-12 px-4">
        <Card className="bg-black/40 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Submit Investment Thesis Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter proposal title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="abstract">Abstract</Label>
                <Textarea
                  id="abstract"
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  placeholder="Provide a brief summary of your proposal"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Specify the category (e.g., SaaS, Healthcare)"
                  required
                />
              </div>
              <div>
                <Label htmlFor="targetMarket">Target Market</Label>
                <Input
                  type="text"
                  id="targetMarket"
                  name="targetMarket"
                  value={formData.targetMarket}
                  onChange={handleChange}
                  placeholder="Define the target market for this investment"
                  required
                />
              </div>
              <div>
                <Label htmlFor="problemStatement">Problem Statement</Label>
                <Textarea
                  id="problemStatement"
                  name="problemStatement"
                  value={formData.problemStatement}
                  onChange={handleChange}
                  placeholder="Describe the problem your proposal addresses"
                  required
                />
              </div>
              <div>
                <Label htmlFor="solutionOffered">Solution Offered</Label>
                <Textarea
                  id="solutionOffered"
                  name="solutionOffered"
                  value={formData.solutionOffered}
                  onChange={handleChange}
                  placeholder="Explain the solution your proposal offers"
                  required
                />
              </div>
              <div>
                <Label htmlFor="revenueModel">Revenue Model</Label>
                <Input
                  type="text"
                  id="revenueModel"
                  name="revenueModel"
                  value={formData.revenueModel}
                  onChange={handleChange}
                  placeholder="Detail the revenue model for this investment"
                  required
                />
              </div>
              <div>
                <Label htmlFor="requiredLGR">Required LGR</Label>
                <Input
                  type="number"
                  id="requiredLGR"
                  name="requiredLGR"
                  value={formData.requiredLGR}
                  onChange={handleChange}
                  placeholder="Enter the amount of LGR required"
                  required
                />
              </div>
              <div>
                <Label htmlFor="teamBackground">Team Background</Label>
                <Textarea
                  id="teamBackground"
                  name="teamBackground"
                  value={formData.teamBackground}
                  onChange={handleChange}
                  placeholder="Describe the team's background and expertise"
                  required
                />
              </div>
              <div>
                <Label htmlFor="additionalInfo">Additional Info</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Provide any additional relevant information"
                />
              </div>
              <Button disabled={isLoading} className="w-full">
                {isLoading ? "Submitting..." : "Submit Proposal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThesisSubmission;
