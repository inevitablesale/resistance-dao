// src/components/marketplace/MintNFTForm.tsx
import { useState } from 'react';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast";
import { useWalletProvider } from '@/hooks/useWalletProvider';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

const mintNFTFormSchema = z.object({
  name: z.string().min(2, {
    message: "NFT name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageURI: z.string().url({
    message: "Image URI must be a valid URL.",
  }),
})

interface MintNFTFormProps {
  wallet: any;
}

export const MintNFTForm: React.FC<MintNFTFormProps> = ({ wallet }) => {
  const [isMinting, setIsMinting] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();
  const { getProvider, validateNetwork } = useWalletProvider();

  const form = useForm<z.infer<typeof mintNFTFormSchema>>({
    resolver: zodResolver(mintNFTFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageURI: "",
    },
  })

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'safeMint',
    args: [address, form.getValues("name"), form.getValues("description"), form.getValues("imageURI")],
    enabled: !!address && form.formState.isValid,
  });

  const { write, data, isLoading: isWriteLoading, isError: isWriteError, error: writeError } = useContractWrite(config);

  const { isLoading: isWaitForTransactionLoading, isError: isWaitForTransactionError, error: waitForTransactionError, isSuccess, } = useWaitForTransaction({
    hash: data?.hash,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;

    try {
      const provider = await getProvider();
      await validateNetwork(provider);

      if (!form.formState.isValid) {
        toast({
          title: "Error",
          description: "Please fill out all fields correctly.",
          variant: "destructive",
        });
        return;
      }

      if (write) {
        setIsMinting(true);
        write();
      }
    } catch (error: any) {
      console.error("Minting error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to mint NFT",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <CardTitle>Mint NFT</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome NFT" className="bg-black/50 border-white/10 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="A unique NFT..." className="bg-black/50 border-white/10 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageURI"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URI</FormLabel>
                  <FormControl>
                    <Input placeholder="ipfs://..." className="bg-black/50 border-white/10 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isMinting || isWriteLoading || isWaitForTransactionLoading}>
              {isMinting || isWriteLoading ? (
                <>
                  Minting...
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2" />
                </>
              ) : (
                "Mint NFT"
              )}
            </Button>

            {isWriteError && (
              <div className="text-red-500">
                Write Error: {(writeError as any)?.message || 'An error occurred while preparing the transaction.'}
              </div>
            )}

            {isWaitForTransactionError && (
              <div className="text-red-500">
                Transaction Error: {(waitForTransactionError as any)?.message || 'An error occurred while waiting for the transaction.'}
              </div>
            )}

            {isSuccess && (
              <div className="text-green-500">
                NFT Minted Successfully!
                <a href={`https://polygonscan.com/tx/${data?.hash}`} target="_blank" rel="noopener noreferrer" className="underline">View on Polygonscan</a>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
