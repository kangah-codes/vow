import passport from "passport";
import {
	Strategy as JwtStrategy,
	ExtractJwt,
	StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { env } from "./env";

const jwtOptions: StrategyOptionsWithoutRequest = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: env.JWT_SECRET,
};

passport.use(
	"jwt",
	new JwtStrategy(jwtOptions, (payload: { userId: string }, done) => {
		if (payload.userId) {
			return done(null, { userId: payload.userId });
		}
		return done(null, false);
	}),
);

export default passport;
