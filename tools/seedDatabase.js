import { connect, disconnect } from 'mongoose';
import chalk from 'chalk';
import User from '../server/users/user.model';
import { url } from '../server/config';

(async () => {
  try {
    await connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    const users = await User.find({});
    if (users.length === 0) {
      console.log(chalk.yellow('No users in the database, creating sample data...'));
      const user = new User({ name: 'John Doe', age: 34 });
      await user.save();
      console.log(chalk.green('Sample user successfuly created!'));
    } else {
      console.log(chalk.yellow('Database already initiated, skipping populating script'));
    }
  } catch (error) {
    console.log(chalk.red(error));
  } finally {
    await disconnect();
  }
})();
