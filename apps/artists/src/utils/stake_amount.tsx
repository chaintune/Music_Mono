import { Network, Provider } from "aptos";

export class StakeAmount {
  private provider = new Provider(Network.DEVNET);
  public moduleAddress = `0x3b0a5292ea996e291839f08f0bbe044e50dcb768af6404b253e6b0d881dc106b`;
  public teamAddress = `0x242c026099140c0d787faf9da562d0aace66700666a4d8fd80dab86756b31660`;
  public streamsThreshold = 1000;
  public stakeAmount = 100000000;
  private isStaked: boolean = false;

  public handleStaking = async () => {
    // @ts-ignore
    const wallet = window?.aptos;
    const response = await wallet.connect();
    const account = await wallet.account();

    if (!account) {
      console.error("No account connected");
      return;
    }

    const lockingPayload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::locked_coins::add_locked_coins`,
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [this.teamAddress, this.stakeAmount, this.streamsThreshold],
    };

    try {
      console.log(account.address);
      const pendingTransaction = await (
        window as any
      ).aptos.signAndSubmitTransaction(lockingPayload);
      console.log(pendingTransaction);
      console.log(this.provider);
      const client = (this.provider as any).aptosClient;
      console.log(client);
      const txn = await client.waitForTransactionWithResult(
        pendingTransaction.hash
      );
      console.log(txn);
      this.isStaked = true;
      localStorage.setItem("isStaked", this.isStaked.toString());
    } catch (error: any) {
      console.error("Error Staking:", error);
    }
    localStorage.setItem("isStaked", this.isStaked.toString());
  };

  public haveStaked = async () => {
    // @ts-ignore
    const wallet = window?.aptos;
    const response = await wallet.connect();
    const account = await wallet.account();

    if (!account) {
      console.error("No account connected");
      return;
    }

    const payload = {
      function: this.moduleAddress + "::locked_coins::artist_exists",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [this.teamAddress, account.address],
    };
    const client = (this.provider as any).aptosClient;
    const check = await client.view(payload);
    if (check == 1) {
      this.isStaked = true;
    } else {
      this.isStaked = false;
    }
    localStorage.setItem("isStaked", this.isStaked.toString());
    return this.isStaked;
  };
}
