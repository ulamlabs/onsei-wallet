import { Divider } from "@/components";
import SafeLayout from "@/components/SafeLayout";
import tw from "@/lib/tailwind";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

type Transaction = {
  type: "Send" | "Receive";
  from: string;
  to: string;
  amount: string;
  asset: string;
  date: string;
};

type TransactionRenderProps = {
  item: Transaction;
  index: number;
};

export default function Transactions() {
  const loading = true;
  const isMore = true;
  const transactions: Transaction[] = [];

  useEffect(() => {
    fetchTxns(0);
    // If there's any notification about balance change, remove it, because user will now see it on txs list
    // cancelNotification(address); TODO: cancel notification
  }, []);

  // eslint-disable-next-line
  async function fetchTxns(page: number) {
    // TODO: handle fetching transactions
  }

  function fetchNextPage() {
    if (isMore) {
      fetchTxns(transactions.length / 20);
    }
  }

  const renderTxn = ({ item, index }: TransactionRenderProps) => {
    return (
      <View key={index} style={tw`my-3`}>
        {(index === 0 || item.date !== transactions[index - 1].date) && (
          <View style={tw`flex-row items-start mt-3`}>
            <Divider styles="opacity-80 flex-1 self-stretch mt-2" />
            <Text style={tw`my-3`}>{item.date}</Text>
            <Divider styles="opacity-80 flex-1 self-stretch mt-2" />
          </View>
        )}
        <View style={tw`flex-row justify-between items-center my-3`}>
          <View>
            <Text>{item.type}</Text>
            <Text style={tw`text-basic-600 text-xs`}>
              {item.type === "Send" ? item.to : item.from}
            </Text>
          </View>

          <Text
            style={tw`${
              item.type === "Send" ? "text-danger-600" : "text-success-600"
            }`}
          >
            {item.type === "Send" ? "-" : "+"}
            {item.amount} {item.asset}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeLayout noScroll={true}>
      <View style={tw`items-center`}>
        <Text style={tw`text-3xl mt-12 mb-8 text-white font-bold`}>
          TRANSACTIONS
        </Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <View style={{ width: "100%", height: "85%" }}>
            {transactions.length > 0 ? (
              <FlatList
                data={transactions}
                nestedScrollEnabled={true}
                renderItem={renderTxn}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                  isMore ? (
                    <View
                      style={{
                        width: "100%",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <ActivityIndicator />
                    </View>
                  ) : (
                    <></>
                  )
                } // Loader when loading next page.
              />
            ) : (
              <Text style={{ textAlign: "center" }}>No transactions yet</Text>
            )}
          </View>
        )}
      </View>
    </SafeLayout>
  );
}
