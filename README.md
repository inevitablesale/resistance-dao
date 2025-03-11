# Resistance DAO Party Integration

A TypeScript integration of PartyDAO's contracts for the Resistance DAO project. This integration provides hooks and utilities for interacting with PartyDAO's governance and crowdfunding features.

## Features

- 🏗️ **Party Creation**: Create new DAOs and crowdfunding campaigns
- 🗳️ **Governance**: Propose, vote, and execute proposals
- 💰 **Distribution**: Manage token distributions and claims
- 🔒 **Type-Safe**: Full TypeScript support with contract type definitions

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- An Ethereum wallet (e.g., MetaMask)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/resistance-dao-party.git
cd resistance-dao-party
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Add your environment variables:
```
NEXT_PUBLIC_INFURA_ID=your_infura_id
NEXT_PUBLIC_CHAIN_ID=1
```

### Usage

```typescript
// Example: Creating a new party
import { usePartyFactory } from './hooks/usePartyFactory';

function CreateParty() {
  const { createParty, loading } = usePartyFactory(FACTORY_ADDRESS);

  const handleCreate = async () => {
    await createParty({
      hosts: ['0x...'],
      voteDuration: 7 * 24 * 60 * 60, // 1 week
      executionDelay: 2 * 24 * 60 * 60, // 2 days
      passThresholdBps: 5100, // 51%
      totalVotingPower: ethers.utils.parseEther('100')
    });
  };

  return <button onClick={handleCreate}>Create Party</button>;
}
```

## Available Hooks

- `usePartyFactory`: Create new parties and crowdfunds
- `usePartyProposal`: Manage governance proposals
- `usePartyDistribution`: Handle token distributions
- `useWalletConnection`: Wallet connection management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details
