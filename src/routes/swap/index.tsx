import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import "../../index.scss";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa"; // Import the left arrow icon
import Footer from "./footer";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGithub, FaTelegram } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import Modal from "react-modal";
import { MdOutlineSwapVert } from "react-icons/md";
import TransactionLoader from "./TransactionLoader";
import { SERVER_API } from "../../utils/constants";
import axios, { AxiosError } from "axios";
import { Params, useParams } from "react-router-dom";

type Tchains =
  | "evm:sepolia"
  | "evm:amoy"
  | "evm:base"
  | "evm:scroll"
  | "evm:optimism"
  | "evm:hedera"
  | "evm:linea"
  | "evm:morph"
  | "evm:flow"
  | "bitcoin";

interface Order {
  amount: number;
  fromChain: Tchains;
  toChain: Tchains;
  fromAddress: string;
  toAddress: string;
  fromAsset: string;
  toAsset: string;
}

interface OrderResponse {
  orderId: number;
  vaultAddress: string;
  orderHash: string;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#0a0b0d",
    padding: 0,
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba(10, 11, 13, 0.75)",
  },
};

interface ChainInfoItem {
  imgurl: string;
  chain: string;
  asset: string;
}

interface ChainInfo {
  [key: string]: ChainInfoItem;
}

export default function Swap() {
  const [activebtn, setActiveBtn] = useState(0);
  const [amount, setAmount] = useState(0);
  const address = useAddress();

  const [animateFirst, setAnimateFirst] = useState(false);
  const [animateSecond, setAnimateSecond] = useState(false);
  const [animateThird, setAnimateThird] = useState(false);
  const [animateFourth, setAnimateFourth] = useState(false);
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [isFirstDropDownOpen, setIsFirstDropDownOpen] = useState(false);
  const [isSecondDropDownOpen, setIsSecondDropDownOpen] = useState(false);

  const handleSecondDropDownClick = () => {
    setIsSecondDropDownOpen(!isSecondDropDownOpen);
  };
  const handleFirstDropDownClick = () => {
    setIsFirstDropDownOpen(!isFirstDropDownOpen);
  };

  const [cur_order_id, setCurOrderId] = useState<number>(0);

  const bitcoinImg =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/2048px-Bitcoin.svg.png";
  const watcherImg = new URL("../../assets/watcher.png", import.meta.url).href;
  const portalGif = new URL("../../assets/portal.gif", import.meta.url).href;
  const coinAudio = new URL("../../assets/coinsound.mp3", import.meta.url).href;

  // const audioloaded = require('~src/assets/coinsound.mp3');

  const audio = new Audio(coinAudio);

  const onSwap = () => {
    if (amount <= 0) {
      toast.error("Please enter an amount");
      return;
    }

    setAnimateFirst(true);

    setTimeout(() => setAnimateSecond(true), 300);
    setTimeout(() => setAnimateThird(true), 1000);
    setTimeout(() => setAnimateFourth(true), 4000);

    setTimeout(() => setAnimateFirst(false), 3000);
    setTimeout(() => setAnimateSecond(false), 4000);
    setTimeout(() => setAnimateThird(false), 6000);
    setTimeout(() => setAnimateFourth(false), 6500);

    setTimeout(() => audio.play(), 3000);

    // create order
    // keep pinging until order is complete
  };

  const [order, setOrder] = useState<Order>({
    amount: 0,
    fromChain: "bitcoin",
    toChain: "evm:sepolia",
    fromAddress: "",
    toAddress: "",
    fromAsset: "",
    toAsset: "",
  });

  const usdcImg = "https://pngimg.com/uploads/bitcoin/bitcoin_PNG5.png";

  const chainInfo: ChainInfo = {
    "evm:sepolia": {
      imgurl:
        "https://p7.hiclipart.com/preview/481/538/559/ethereum-t-shirt-cryptocurrency-bitcoin-blockchain-t-shirt.jpg",
      chain: "Ethereum",
      asset: "0xa0907fA317E90d6cE330d28565E040f0474E932E",
    },
    "evm:amoy": {
      imgurl:
        "https://cdn.prod.website-files.com/637e2b6d602973ea0941d482/63e26c8a3f6e812d91a7aa3d_Polygon-New-Logo-p-500.png",
      chain: "Polygon",
      asset: "0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D",
    },
    "evm:base": {
      imgurl:
        "https://moonpay-marketing-c337344.payloadcms.app/media/base%20logo.webp",
      chain: "Base",
      asset: "0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D",
    },
    "evm:scroll": {
      imgurl: "https://airdrops.io/wp-content/uploads/2022/11/Scroll-logo.jpg",
      chain: "Scroll",
      asset: "0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D",
    },
    "evm:optimism": {
      imgurl:
        "https://assets.coingecko.com/coins/images/25244/large/Optimism.png?1696524385",
      chain: "Optimism",
      asset: "0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D",
    },
    "evm:hedera": {
      asset : "0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D",
      chain: "Hedera",
      imgurl: "https://s2.coinmarketcap.com/static/img/coins/200x200/4642.png",
    },
    "evm:linea": {
      asset : "0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D",
      chain: "Linea",
      imgurl: "https://automata-network.github.io/ata.lib/1rpc/networks/linea.svg",
    },
    "evm:morph": {
      asset : "0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D",
      chain: "Morph",
      imgurl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXXKu8Vf-aQc0quOwWeQhdGWA-lqUz5fMG5Q&s",
    },
    "evm:flow": {
      asset : "0xdbfa6D8aC5e5d684E4Fe6B0830242D8A716E748D",
      chain: "Flow",
      imgurl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEI0_echN9PV9WmFWqQFBSfsjLfNO-IhxZdA&s",
    },
    bitcoin: {
      imgurl:
        "https://c.media-amazon.com/images/I/61Iw4aixZ1L._SX300_SY300_QL70_FMwebp_.jpg",
      chain: "Bitcoin",
      asset: "btc",
    },
  };

  const handleSubmit = async (e: any) => {
    order.amount = Number(amount);
    console.log("Order:", order);
    if (order.toChain.startsWith("evm:")) {
      order.toAddress = address!;
    }

    /// get order details and create order
    if (order.amount < 0.001 || order.toAddress === "") {
      toast.error("Please fill all the fields");
      return;
    }

    if (address === "" || address === undefined) {
      toast.error("Please connect your wallet");
      return;
    }
    e.preventDefault();

    order.fromAsset = chainInfo[order.fromChain].asset;
    order.toAsset = chainInfo[order.toChain].asset;

    const response = await createOrder(order);
    if (response === null) {
      return;
    }

    // setCurOrderStatus("created");
    // setCurDepositAddr(response.vaultAddress);
    // setCurToChain(order.toChain);
    // setCurAmount(order.amount);
    setModelOpen(true);
    setCurOrderId(response.orderId);
    toast.success("Order created successfully");

    // onSwap();
  };

  async function createOrder(orderData: Order): Promise<OrderResponse | null> {
    try {
      const response = await axios.post<OrderResponse>(SERVER_API, orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response) {
          console.log("Error data:", axiosError.response.data);
          toast.error(
            `Error Creating order: ${
              axiosError.message || axiosError.response.data.error
            }`
          );
          return null;
        } else {
          toast.error(`Error Creating order: ${axiosError.message}`);
          return null;
        }
      } else {
        toast.error(`Error Ccreating order: ${error}`);
        return null;
      }
    }
  }

  const swapDirection = () => {
    const current_chain = order.fromChain;
    console.log("Current chain:", current_chain, order);
    setOrder((prevState) => ({
      ...prevState,
      fromChain: prevState.toChain,
      toChain: current_chain,
      toAddress: prevState.toChain.startsWith("evm:") ? address! : "",
    }));
    console.log("After Change :", order);
  };

  interface TransferParams extends Params {
    amountfromurl?: string;
    fromchain?: string;
    tochain?: string;
  }

  const { amountfromurl, fromchain, tochain } = useParams<TransferParams>();

  useEffect(() => {
    const amountNumber = amountfromurl ? parseFloat(amountfromurl) : null;

    if (amountNumber) {
      setAmount(amountNumber);
      setOrder((prevOrder) => ({
        ...prevOrder,
        amount: amountNumber,
        fromChain: (fromchain ? fromchain : prevOrder.fromChain) as Tchains,
        toChain: (tochain ? tochain : prevOrder.toChain) as Tchains,
        toAsset:
          chainInfo[(tochain ? tochain : prevOrder.toChain) as Tchains].asset,
        fromAsset:
          chainInfo[(fromchain ? fromchain : prevOrder.fromChain) as Tchains]
            .asset,
      }));
    }
  }, [amountfromurl, fromchain, tochain]);

  return (
    <div>
      <div className="SwapUi bg-opacity-90 text-white w-screen h-screen">
        <div className="absolute top-5 left-5 flex items-center space-x-4 z-50">
          <FaArrowLeft
            className="text-2xl cursor-pointer hover:text-gray-500"
            onClick={() => (window.location.href = "/")}
          />
          <a href="/" className="text-2xl font-extrabold italic">
            Ozone Bridge
          </a>
        </div>
        <ConnectWallet className="connect-btn m-7 z-50 neon-border bg-gray-100 text-gray-200 text-sm bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-100 py-2 px-4 rounded-full hover:bg-opacity-30 transition duration-300 ease-in-out" />
        <div className="absolute w-screen flex items-center justify-center top-10 z-50">
          <div className="flex items-center cursor-pointer bg-gray-100 text-gray-200 text-sm bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-100 py-1 rounded-full px-3">
            <div
              className={` py-1 px-3 rounded-full ${
                activebtn === 0 ? "bg-gray-800" : ""
              } `}
              onMouseEnter={() => setActiveBtn(0)}
            >
              Swap
            </div>
            <div
              className={` py-1 px-3 rounded-full ${
                activebtn === 1 ? "bg-gray-800" : ""
              } `}
              onMouseEnter={() => setActiveBtn(1)}
            >
              Liquidity
            </div>
            <div
              className={` py-1 px-3 rounded-full ${
                activebtn === 2 ? "bg-gray-800" : ""
              } `}
              onMouseEnter={() => setActiveBtn(2)}
            >
              History
            </div>
          </div>
        </div>
        <div className="w-full h-screen flex justify-center items-center bg-black relative">
          <div className="shooting-stars z-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 3 + 3}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>
          <div className="swap-card border-opacity-40 p-5 glassmorphic-bg rounded-3xl shadow-neon">
            <div className="font-bold text-gray-300 text-xs tracking-wide">
              I'd like to Swap
            </div>
            <div className="flex space-x-4 my-5 items-center text-gray-300">
              <div className="border rounded-lg border-gray-500 p-2 flex items-center w-44 justify-between neon-border">
                <div className="flex space-x-1 items-center">
                  <div className="rounded-full overflow-hidden futuristic-icon">
                    <img
                      src={
                        order.fromChain.startsWith("evm:")
                          ? usdcImg
                          : bitcoinImg
                      }
                      className="w-5 h-5 overflow-hidden rounded-full futuristic-icon"
                      alt="usdc"
                    />
                  </div>
                  <div>
                    {order.fromChain.startsWith("evm:") ? "xBTC" : "BTC"}
                  </div>
                </div>
                <div>
                  {/* <IoMdArrowDropdown className="text-lg text-neon" />{" "} */}
                </div>
              </div>
              <div className="text-gray-500 font-extrabold tracking-wide">
                on
              </div>
              <div className="relative">
                <div
                  onClick={() => handleFirstDropDownClick()}
                  className="border rounded-lg cursor-pointer border-gray-500 p-2 flex items-center w-44 justify-between neon-border"
                >
                  <div className="flex space-x-1 items-center ">
                    <div>
                      <img
                        alt="Ethereum"
                        src={chainInfo[order.fromChain].imgurl}
                        className="w-5 h-5 rounded-full futuristic-icon"
                      />
                    </div>
                    <div>{chainInfo[order.fromChain].chain}</div>
                  </div>
                  <div>
                    <IoMdArrowDropdown className="text-lg text-neon" />{" "}
                  </div>
                </div>
                {isFirstDropDownOpen && (
                  <div className="absolute z-50 mt-2 w-44 rounded-md shadow-lg cursor-pointer bg-gray-800 text-gray-100 ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {Object.keys(chainInfo).map((key) => {
                        if (key === order.fromChain || key === order.toChain) {
                          return null;
                        }
                        return (
                          <div
                            onClick={() => {
                              setOrder((prevState) => ({
                                ...prevState,
                                fromChain: key as Tchains,
                              }));
                            }}
                            className="block px-4 py-2 text-sm   hover:bg-gray-500"
                            role="menuitem"
                          >
                            <div>
                              <div className="flex space-x-2 items-center ">
                                <div>
                                  <img
                                    alt="chain"
                                    src={chainInfo[key].imgurl}
                                    className="w-5 h-5 rounded-full"
                                  />
                                </div>
                                <div>{chainInfo[key].chain}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full rounded-lg border flex border-gray-500 bg-transparent items-center neon-border">
              <input
                placeholder="Enter Amount"
                type="number"
                step="0.00001000"
                className="rounded-l-lg outline-none w-10/12 px-3 py-2 bg-black"
                value={amount === 0 ? "" : (amount / 100000000).toFixed(8)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setAmount(0);
                  } else {
                    const floatValue = parseFloat(value);
                    if (!isNaN(floatValue)) {
                      setAmount(Math.round(floatValue * 100000000));
                    }
                  }
                }}
              />
              <div className="px-3 py-2 text-xs font-bold bg-transparent text-neon">
                MAX
              </div>
            </div>
            <div className="flex my-5 items-center space-x-2">
              <hr className="w-1/2 text-gray-700 bg-gray-800 h-px border-0" />
              <div className="text-xs font-extrabold text-gray-500 tracking-wide">
                <MdOutlineSwapVert
                  className="text-2xl cursor-pointer hover:text-gray-500 transition-all duration-300 transform hover:scale-110 border p-1 rounded-full neon-border"
                  onClick={() => swapDirection()}
                />
              </div>
              <hr className="w-1/2 text-gray-700 bg-gray-800 h-px border-0" />
            </div>
            <div className="flex space-x-4 my-5 items-center text-gray-300">
              <div className="border rounded-lg border-gray-500 p-2 flex items-center w-44 justify-between neon-border">
                <div className="flex space-x-1 items-center">
                  <div>
                    <img
                      src={
                        order.toChain.startsWith("evm:") ? bitcoinImg : usdcImg
                      }
                      className="w-5 h-5 futuristic-icon"
                      alt="usdc"
                    />
                  </div>
                  <div>{order.toChain.startsWith("evm:") ? "xBTC" : "BTC"}</div>
                </div>
                <div>
                  {/* <IoMdArrowDropdown className="text-lg text-neon" />{" "} */}
                </div>
              </div>
              <div className="text-gray-500 font-extrabold tracking-wide">
                on
              </div>
              <div
                className="relative"
                onClick={() => handleSecondDropDownClick()}
              >
                <div className="border rounded-lg border-gray-500 cursor-pointer p-2 flex items-center w-44 justify-between neon-border">
                  <div className="flex space-x-1 items-center">
                    <div>
                      <img
                        src={chainInfo[order.toChain].imgurl}
                        className="w-5 h-5 rounded-full futuristic-icon"
                        alt="Ethereum"
                      />
                    </div>
                    <div>{chainInfo[order.toChain].chain}</div>
                  </div>
                  <div>
                    <IoMdArrowDropdown className="text-lg text-neon" />{" "}
                  </div>
                </div>

                {isSecondDropDownOpen && (
                  <div className="absolute z-50 mt-2 w-44 rounded-md shadow-lg cursor-pointer bg-gray-800 text-gray-100 ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {Object.keys(chainInfo).map((key) => {
                        if (key === order.fromChain || key === order.toChain) {
                          return null;
                        }
                        return (
                          <div
                            onClick={() => {
                              setOrder((prevState) => ({
                                ...prevState,
                                toChain: key as Tchains,
                              }));
                            }}
                            className="block px-4 py-2 text-sm   hover:bg-gray-500"
                            role="menuitem"
                          >
                            <div>
                              <div className="flex space-x-2 items-center ">
                                <div>
                                  <img
                                    alt="chain"
                                    src={chainInfo[key].imgurl}
                                    className="w-5 h-5 rounded-full"
                                  />
                                </div>
                                <div>{chainInfo[key].chain}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full rounded-lg border flex justify-between  border-gray-500  items-center neon-border">
              <input
                placeholder="You Receive"
                className="rounded-l-lg outline-none px-3 py-2 bg-transparent text-neon placeholder-neon"
                disabled={true}
                value={amount === 0 ? "" : amount * 0.997}
              ></input>
              <div className="px-3 py-4 text-xs font-bold text-neon">
                0.3% Fee
              </div>
            </div>
            <div
              className={`w-full rounded-lg border flex justify-between  border-gray-500  items-center mt-3 ${
                order.toChain === "bitcoin" ? "" : "hidden"
              }`}
            >
              <input
                placeholder="Recipient Bitcoin Address"
                className="rounded-l-lg outline-none  px-3 py-2 bg-black w-full"
                onChange={(e) =>
                  setOrder({ ...order, toAddress: e.target.value })
                }
              ></input>
            </div>
            <div
              onClick={
                address === undefined
                  ? () => toast.error("Please connect wallet")
                  : (e) => handleSubmit(e)
              }
              className="w-full flex items-center font-extrabold justify-center py-4 rounded-xl hover:scale-105 transform transition-all mt-5 cursor-pointer glassmorphicFAQ text-neon"
            >
              Swap
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modelOpen} className="" style={customStyles}>
        <TransactionLoader
          setModelOpen={setModelOpen}
          orderId={cur_order_id}
          onSwap={onSwap}
        />
      </Modal>
      <div className="flex justify-between w-screen text-white fixed bottom-0 z-50 mb-7 items-center">
        <a href="/" className="ml-5 text-xl font-extrabold italic">
          <div className="h-10">
            {/* <img src="https://cdn.dribbble.com/users/1669977/screenshots/6924551/gears_web.gif" alt="" /> */}
          </div>
        </a>
        <div className="flex mr-10 cursor-pointer space-x-2">
          <div>
            <FaSquareXTwitter className="text-3xl hover:text-gray-500 " />
          </div>
          <div>
            <FaTelegram className="text-3xl hover:text-gray-500" />
          </div>
          <div>
            <FaGithub className="text-3xl hover:text-gray-500" />
          </div>
        </div>
      </div>
      <Footer />
      <div>
        <Toaster position="top-center" />
      </div>
      <div
        className={`fixed z-40 bottom-7 -left-1  imagerotate transform duration-75 ease-in transition-all ${
          animateFirst ? "opacity-100 " : "opacity-0"
        }`}
      >
        <img src={watcherImg} className="w-80" alt="" />
      </div>
      <div
        className={`fixed z-40 bottom-9 right-0  rotate-90 transform duration-300 ease-in transition-all ${
          animateThird ? "opacity-100" : "opacity-0"
        }`}
      >
        <img src={portalGif} className="h-60" alt="" />
      </div>
      <ul
        className={`fixed z-40  bottom-24 left-0 w-screen h-36  text-white   ${
          animateSecond ? "" : "hidden"
        }`}
      >
        <div className="circles absolute  overflow-hidden w-10/12  h-full left-24 ">
          {" "}
          <li
            className=" relative  top-5"
            style={{
              backgroundImage: `url('${chainInfo[order.fromChain].imgurl}')`,
            }}
          />
          <li
            className=" relative  top-10"
            style={{
              backgroundImage: `url('${chainInfo[order.fromChain].imgurl}')`,
            }}
          />
          <li
            className=" relative  top-24"
            style={{
              backgroundImage: `url('${chainInfo[order.fromChain].imgurl}')`,
            }}
          />
          <li
            className=" relative  top-14"
            style={{
              backgroundImage: `url('${chainInfo[order.fromChain].imgurl}')`,
            }}
          />
        </div>
      </ul>
      <ul
        className={`fixed z-40  bottom-0 right-10 h-screen w-36  text-white ${
          animateFourth ? "" : "hidden"
        }`}
      >
        <div className="horicircles absolute bottom-24 overflow-hidden w-full  h-5/6  ">
          <li
            className=" relative  left-5 mb-14"
            style={{
              backgroundImage: `url('${chainInfo[order.toChain].imgurl}')`,
            }}
          />
          <li
            className=" relative  left-10 mb-14"
            style={{
              backgroundImage: `url('${chainInfo[order.toChain].imgurl}')`,
            }}
          />
          <li
            className=" relative  left-16 mb-14"
            style={{
              backgroundImage: `url('${chainInfo[order.toChain].imgurl}')`,
            }}
          />
          <li
            className=" relative  left-14 mb-14"
            style={{
              backgroundImage: `url('${chainInfo[order.toChain].imgurl}')`,
            }}
          />
        </div>
      </ul>
    </div>
  );
}
