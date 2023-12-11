import { AptosAccount, AptosClient, BCS, HexString, Network, Provider } from "aptos";

export class StakeAmount {
  private provider = new Provider(Network.DEVNET);
  private privateKeyHex = "0xddb7925e1958cbbc6aa9be59ed6a8107b8b157634e51a7f09f1ca20f7440f785"; //process.env.PRIVATE_KEY;
  private privateKeyBytes = HexString.ensure(this.privateKeyHex).toUint8Array();
  public moduleAddress = "0xb1218f0b139e190ff6f7bb194d424ea3b51180eef4de7a4a8ea7cf3c9a571ba0";
  public teamAddress = "0x242c026099140c0d787faf9da562d0aace66700666a4d8fd80dab86756b31660";
  public streamsThreshold = 1000;
  public stakeAmount = 100000000;
  private isStaked: boolean = false;
  private initializeSponsor = async () => {
    const aptosClient = new AptosClient('https://fullnode.devnet.aptoslabs.com');
    const account = new AptosAccount(this.privateKeyBytes);
    const se = new BCS.Serializer();
    se.serializeStr("entry_function_payload");
    se.serializeStr(this.moduleAddress + "::locked_coins::initialize_sponsor");
    se.serializeU32(1);
    se.serializeStr("0x1::aptos_coin::AptosCoin");
    se.serializeU32(1);
    se.serializeStr(this.teamAddress);
    const initPayload = {
      type: "entry_function_payload",
      function: this.moduleAddress + "::locked_coins::initialize_sponsor",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [this.teamAddress],
      serialize: () => se.getBytes(),
    };
    const rawTxn = await aptosClient.generateRawTransaction(account.address(), initPayload);
    console.log(rawTxn);
    const signedTxn = await aptosClient.signTransaction(account, rawTxn);
    console.log(signedTxn);
  }

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
      function: this.moduleAddress + "::locked_coins::add_locked_coins",
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
    } catch (error: any) {
      console.error("Error Staking:", error);
    }
  }

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
    }
    else {
      this.isStaked = false;
    }

    return this.isStaked;

  }

}