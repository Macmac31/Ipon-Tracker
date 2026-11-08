// CONTROLLER: the only layer that talks to both the model and the views.
import * as model from './model.js';
import ScreenView from './views/ScreenView.js';
import AuthView from './views/AuthView.js';
import HeaderView from './views/HeaderView.js';
import SidebarView from './views/SidebarView.js';
import SummaryView from './views/SummaryView.js';
import ChartView from './views/ChartView.js';
import GoalFormView from './views/GoalFormView.js';
import DepositFormView from './views/DepositFormView.js';
import DepositListView from './views/DepositListView.js';

const screenView = new ScreenView();
const authView = new AuthView();
const headerView = new HeaderView();
const sidebarView = new SidebarView();
const summaryView = new SummaryView();
const chartView = new ChartView();
const goalFormView = new GoalFormView();
const depositFormView = new DepositFormView();
const depositListView = new DepositListView();

const renderStats = () => {
  const summary = model.getSummary();
  sidebarView.render({ user: model.state.user, goal: model.state.goal, summary });
  summaryView.render(summary);
  chartView.render(model.getWeeklyTotals());
};

const renderBlankDepositForm = () =>
  depositFormView.render({ deposit: null, today: model.todayISO() });

const showDashboard = () => {
  headerView.render({ name: model.state.user.name });
  renderStats();
  goalFormView.render(model.state.goal);
  renderBlankDepositForm();
  depositListView.render(model.getDeposits());
  screenView.show('app');
};

const showAuth = (mode = 'login') => {
  authView.render({ mode });
  screenView.show('auth');
};

const controlAuth = async (data) => {
  const error = data.mode === 'login' ? await model.loginUser(data) : await model.registerUser(data);
  if (error) return authView.renderError(error);
  showDashboard();
};

const controlLogout = () => {
  model.logout();
  showAuth('login');
};

const controlSaveGoal = (data) => {
  const error = model.saveGoal(data);
  if (error) return goalFormView.renderError(error);
  renderStats();
};

const controlSaveDeposit = (data) => {
  const error = model.saveDeposit(data);
  if (error) return depositFormView.renderError(error);
  renderBlankDepositForm();
  depositListView.render(model.getDeposits());
  renderStats();
};

const controlEditDeposit = (id) => {
  const deposit = model.getDeposits().find((d) => d.id === id);
  depositFormView.render({ deposit, today: model.todayISO() });
};

const controlDeleteDeposit = (id) => {
  model.deleteDeposit(id);
  depositListView.render(model.getDeposits());
  renderStats();
};

const init = () => {
  model.loadState();
  authView.addHandlerSubmit(controlAuth);
  authView.addHandlerSwitch(showAuth);
  headerView.addHandlerLogout(controlLogout);
  goalFormView.addHandlerSubmit(controlSaveGoal);
  depositFormView.addHandlerSubmit(controlSaveDeposit);
  depositFormView.addHandlerCancel(renderBlankDepositForm);
  depositListView.addHandlerEdit(controlEditDeposit);
  depositListView.addHandlerDelete(controlDeleteDeposit);
  model.state.user ? showDashboard() : showAuth('login');
};

init();
