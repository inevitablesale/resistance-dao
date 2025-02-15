
function Layout() {
  const { toast } = useToast();
  const { tokenBalances, isLoading, error } = useTokenBalances();

  // Log token balances when they change
  React.useEffect(() => {
    if (tokenBalances && !isLoading && !error) {
      console.log("Token balances updated:", tokenBalances);
      // Find LGR token balance
      const lgrToken = tokenBalances.find(token => token.symbol === 'LGR');
      if (lgrToken) {
        toast({
          title: "LGR Balance Updated",
          description: `Your LGR balance: ${lgrToken.balance} LGR`,
        });
      }
    }
  }, [tokenBalances, isLoading, error, toast]);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/governance-voting" element={<GovernanceVoting />} />
      <Route path="/mint-nft" element={<MintNFT />} />
      <Route path="/share-to-earn" element={<ShareToEarn />} />
      <Route path="/litepaper" element={<Litepaper />} />
      <Route path="/getting-started" element={<GettingStarted />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/:category/:slug" element={<KnowledgeArticle />} />
      <Route path="/content" element={<ContentHub />} />
      <Route path="/submit-thesis" element={<ThesisSubmission />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
