import {
  GnoWallet,
  GnoWSProvider,
  GnoJSONRPCProvider,
  defaultTxFee,
} from "@gnolang/gno-js-client";
import Long from "long";
import {
  BroadcastTxCommitResult,
  TransactionEndpoint,
  TM2Error,
} from "@gnolang/tm2-js-client";
import Config from "./config";
import { ErrorTransform } from "./errors";
import { defaultWalletKey } from "../types/types";
import { generateMnemonic } from "./crypto";
import { saveToLocalStorage } from "./localstorage";
import { getFromLocalStorage } from "./localstorage";
import { useEffect } from "react";

const defaultGasWanted: Long = new Long(300_000_0);
const postItRealm: string = Config.GNO_POSTIT_REALM;
const customTXFee = "2000000ugnot";
const rpcURL: string = Config.GNO_JSONRPC_URL;

const cleanUpRealmReturn = (ret: string) => {
  return ret.slice(2, -9).replace(/\\"/g, '"');
};
const decodeRealmResponse = (resp: string) => {
  return cleanUpRealmReturn(atob(resp));
};

const parsedJSONOrRaw = (data: string, nob64 = false) => {
  const decoded = nob64 ? cleanUpRealmReturn(data) : decodeRealmResponse(data);
  try {
    return JSON.parse(decoded);
  } finally {
    return decoded;
  }
};

class Actions {
  private static instance: Actions;

  private static initPromise: Actions | PromiseLike<Actions>;
  private wallet: GnoWallet | null = null;
  private provider: GnoWSProvider | null = null;
  private providerJSON: GnoJSONRPCProvider | null = null;
  private faucetToken: string | null = null;

  private constructor() {}

  public static async getInstance(): Promise<Actions> {
    if (!Actions.instance) {
      Actions.instance = new Actions();
      Actions.initPromise = new Promise(async (resolve) => {
        await Actions.instance.initialize();
        resolve(Actions.instance);
      });
      return Actions.initPromise;
    } else {
      return Actions.initPromise;
    }
  }

  private async initialize() {
    // Wallet initialization //

    // Try to load the mnemonic from local storage

    let walletInfo: string | null = getFromLocalStorage(defaultWalletKey);

    try {
      let jsonWalletInfo = JSON.parse(walletInfo);
      this.wallet = await GnoWallet.fromMnemonic(jsonWalletInfo.mnemonic);
      console.log(this.wallet);
      // Initialize the provider
      //this.provider = new GnoWSProvider(wsURL);
      this.providerJSON = new GnoJSONRPCProvider(rpcURL);
      console.log(this.providerJSON);
      // Connect the wallet to the provider
      this.wallet.connect(this.providerJSON);
    } catch (e) {
      //Should not happen
      console.error("Could not create wallet");
    }

    /*
    // Faucet token initialization //
    let faucetToken: string | null = localStorage.getItem(
      defaultFaucetTokenKey
    );
    if (faucetToken && faucetToken !== '') {
      // Faucet token initialized
      this.faucetToken = faucetToken;
      try {
        // Attempt to fund the account
        await this.fundAccount(this.faucetToken);
      } catch (e) {
        if (e instanceof UserFundedError) {
          console.log('User already funded.');
        } else {
          console.error('Could not fund user.');
        }
      }
    }*/
  }

  private gkLog(): Boolean {
    if (typeof window !== "undefined") {
      const wnd = window as { gnokeyLog?: Boolean };
    }
    //return typeof wnd.gnokeyLog !== 'undefined' && wnd.gnokeyLog;
    return true;
  }

  public async callMethod(
    method: string,
    args: string[] | null,
    gasWanted: Long = defaultGasWanted
  ): Promise<BroadcastTxCommitResult> {
    const gkLog = this.gkLog();
    try {
      if (gkLog) {
        const gkArgs = args?.map((arg) => "-args " + arg).join(" ") ?? "";
        console.log(
          `$ gnokey maketx call -broadcast ` +
            `-pkgpath ${postItRealm} -gas-wanted ${gasWanted} -gas-fee ${defaultTxFee} ` +
            `-func ${method} ${gkArgs} test`
        );
      }

      const resp = (await this.wallet?.callMethod(
        postItRealm,
        method,
        args,
        TransactionEndpoint.BROADCAST_TX_COMMIT,
        undefined,
        {
          gasFee: customTXFee,
          gasWanted: gasWanted,
        }
      )) as BroadcastTxCommitResult;
      if (gkLog) {
        console.info("response:", JSON.stringify(resp));
        const respData = resp.deliver_tx.ResponseBase.Data;
        if (respData !== null) {
          console.info("response (parsed):", parsedJSONOrRaw(respData));
          return parsedJSONOrRaw(respData);
        }
      }
      return resp;
    } catch (err) {
      if (err !== undefined) {
        let error: TM2Error;
        const ex = err as { log?: string; message?: string } | undefined;
        if (
          typeof ex?.log !== "undefined" &&
          typeof ex?.message !== "undefined" &&
          ex.message.includes("abci.StringError")
        ) {
          error = ErrorTransform(err as TM2Error);
        }
        if (gkLog) {
          console.log("error:", error);
        }
        throw error;
      }
    }
  }

  public destroy() {
    if (!this.provider) {
      return;
    }
  }

  async createWallet(mnemonic: string): Promise<any> {
    try {
      await GnoWallet.fromMnemonic(mnemonic).then(async (res) => {
        let address = await res.getAddress();
        saveToLocalStorage(
          defaultWalletKey,
          JSON.stringify({ mnemonic: mnemonic, address: address })
        );
      });
    } catch {
      console.error("Could not create wallet from mnemonic");
    }
  }

  async getAddress(): Promise<any> {
    try {
      let wallet: string | null = getFromLocalStorage(defaultWalletKey);
      let jsonWallet = JSON.parse(wallet);
      let address = jsonWallet.address;
      return address;
    } catch {
      console.error("Error in getting address");
    }
  }

  async createUser(username: string, name: string): Promise<any> {
    const createNewUser = await this.callMethod("CreateUser", [username, name]);
    console.log("actions createuser response ", JSON.stringify(createNewUser));
    return createNewUser;
  }

  async createPost(body: string): Promise<any> {
    const createNewPost = await this.callMethod("CreatePost", [body]);
    console.log("actions creatpost response ", JSON.stringify(createNewPost));
    return createNewPost;
  }
}

export default Actions;
