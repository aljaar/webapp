import { service } from "../../sdk";

export default () => ({
  transactions: [],
  async init () {
    const { data: transactions } = await service.transaction.lists();
    console.log(transactions);
    this.transactions = transactions;
  },
  isCategory (tx, category) {
    return (tx.products.category === category);
  },
  useStatusClass (status) {
    return {
      'bg-yellow-100 text-yellow-600': (status === 'waiting'),
      'bg-blue-100 text-blue-600': (status === 'approved'),
      'bg-red-100 text-red-600': (status === 'rejected'),
      'bg-emerald-100 text-green-600': (status === 'success')
    }
  }
});
