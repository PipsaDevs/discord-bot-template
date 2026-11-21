#!/usr/bin/env bash

set -euo pipefail

TEMPLATE_REPO="https://github.com/PipsaDevs/discord-bot-template.git"
TARGET_DIR=""
REMOTE_URL=""

# Terminal color & formatting detection (respects NO_COLOR and non-interactive TTYs)
if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]] && [[ "${TERM:-}" != "dumb" ]]; then
	BOLD="\033[1m"
	DIM="\033[2m"
	RESET="\033[0m"
	CYAN="\033[36m"
	BLUE="\033[34m"
	GREEN="\033[32m"
	YELLOW="\033[33m"
	RED="\033[31m"
	MAGENTA="\033[35m"
	USE_COLOR="1"
else
	BOLD=""
	DIM=""
	RESET=""
	CYAN=""
	BLUE=""
	GREEN=""
	YELLOW=""
	RED=""
	MAGENTA=""
	USE_COLOR="0"
fi
export USE_COLOR

log_step() {
	local current="$1"
	local total="$2"
	shift 2
	printf "\n${MAGENTA}${BOLD}✦ [%s/%s]${RESET} ${BOLD}%s${RESET}\n" "$current" "$total" "$*"
}

log_info() {
	printf "  ${CYAN}ℹ${RESET} %s\n" "$*"
}

log_success() {
	printf "  ${GREEN}✔${RESET} %s\n" "$*"
}

log_warn() {
	printf "  ${YELLOW}⚠${RESET} %s\n" "$*"
}

log_error() {
	printf "${RED}${BOLD}✖ Error:${RESET} %s\n" "$*" >&2
}

usage() {
	cat <<EOF
${BOLD}Usage:${RESET} install.sh [options]

${BOLD}Options:${RESET}
  ${CYAN}-d, --directory${RESET} ${DIM}DIR${RESET}  Create the project in DIR (standalone mode)
  ${CYAN}-r, --remote${RESET}    ${DIM}URL${RESET}  Set the Git origin remote in standalone mode
  ${CYAN}-h, --help${RESET}           Show this help

When run inside an existing template checkout, the script refreshes that
project in place and preserves its existing Git remotes.
EOF
}

while (($#)); do
	case "$1" in
		-d|--directory)
			TARGET_DIR="${2:-}"
			[[ -n "$TARGET_DIR" ]] || { log_error "Missing value for $1"; exit 2; }
			shift 2
			;;
		-r|--remote)
			REMOTE_URL="${2:-}"
			[[ -n "$REMOTE_URL" ]] || { log_error "Missing value for $1"; exit 2; }
			shift 2
			;;
		-h|--help)
			usage
			exit 0
			;;
		*)
			log_error "Unknown option: $1"
			usage >&2
			exit 2
			;;
	esac
done

log_step 1 5 "Checking environment and required tools"

for tool in node git; do
	if ! command -v "$tool" >/dev/null 2>&1; then
		log_error "Missing required tool: $tool"
		exit 1
	fi
	log_success "Found $tool ($(command -v "$tool"))"
done

if command -v pnpm >/dev/null 2>&1; then
	PNPM="pnpm"
	log_success "Using pnpm ($(pnpm --version 2>/dev/null || echo 'detected'))"
elif command -v corepack >/dev/null 2>&1; then
	PNPM="corepack pnpm"
	log_success "Using Corepack pnpm"
else
	log_error "Missing pnpm or Corepack. Please install pnpm or enable Corepack."
	exit 1
fi

mode="refresh"

log_step 2 5 "Preparing project workspace"

if [[ -f "$PWD/package.json" ]] && [[ -z "$TARGET_DIR" ]]; then
	TARGET_DIR="$PWD"
	mode="refresh"
	log_info "Mode: refresh (updating current directory in-place)"
elif [[ -n "$TARGET_DIR" ]] && [[ -f "$TARGET_DIR/package.json" ]]; then
	TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"
	mode="refresh"
	log_info "Mode: refresh (updating $TARGET_DIR in-place)"
else
	mode="standalone"
	if [[ -z "$TARGET_DIR" ]]; then
		if [[ -t 0 ]]; then
			printf "  ${CYAN}❯${RESET} ${BOLD}Project directory${RESET} ${DIM}[discord-bot-project]${RESET}: "
			read -r TARGET_DIR
		fi
		TARGET_DIR="${TARGET_DIR:-discord-bot-project}"
	fi

	if [[ "$TARGET_DIR" != /* ]]; then
		TARGET_DIR="$PWD/$TARGET_DIR"
	fi

	if [[ -e "$TARGET_DIR" ]]; then
		log_error "Target directory already exists: $TARGET_DIR"
		exit 1
	fi

	log_info "Mode: standalone (new project at $TARGET_DIR)"
	parent_dir="$(dirname "$TARGET_DIR")"
	mkdir -p "$parent_dir"
	log_info "Downloading template into $TARGET_DIR..."
	git clone --depth 1 "$TEMPLATE_REPO" "$TARGET_DIR"
	cd "$TARGET_DIR"

	if [[ -d "$TARGET_DIR/.git" ]]; then
		rm -rf "$TARGET_DIR/.git"
	fi
	git init -b main
	if [[ -n "$REMOTE_URL" ]]; then
		git remote add origin "$REMOTE_URL"
		log_success "Configured Git remote: $REMOTE_URL"
	fi

	if [[ -f "$TARGET_DIR/.env.example" ]] && [[ ! -f "$TARGET_DIR/.env" ]]; then
		cp "$TARGET_DIR/.env.example" "$TARGET_DIR/.env"
		log_success "Created .env from .env.example"
	fi
fi

cd "$TARGET_DIR"

if [[ ! -f package.json ]]; then
	log_error "No package.json found in $TARGET_DIR"
	exit 1
fi

if [[ ! -f src/index.ts ]]; then
	log_error "This directory does not look like the Discord bot template."
	exit 1
fi

temp_dir="$(mktemp -d)"
rollback=1
rollback_files() {
	status=$?
	if (( rollback == 1 )); then
		cp "$temp_dir/package.json.backup" package.json 2>/dev/null || true
		if [[ -f "$temp_dir/pnpm-lock.yaml.backup" ]]; then
			cp "$temp_dir/pnpm-lock.yaml.backup" pnpm-lock.yaml
		else
			rm -f pnpm-lock.yaml
		fi
		log_error "Installation failed. Previous package.json and lockfile were restored."
	fi
	rm -rf "$temp_dir"
	exit "$status"
}
trap rollback_files EXIT

if [[ -f package.json ]]; then
	cp package.json "$temp_dir/package.json.backup"
fi
if [[ -f pnpm-lock.yaml ]]; then
	cp pnpm-lock.yaml "$temp_dir/pnpm-lock.yaml.backup"
fi

ORIGIN_URL=""
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
	ORIGIN_URL="$(git remote get-url origin 2>/dev/null || true)"
fi

PROJECT_NAME="$(basename "$TARGET_DIR" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9._-]/-/g')"
if [[ -n "$ORIGIN_URL" ]]; then
	remote_name="$(printf '%s\n' "$ORIGIN_URL" \
		| sed -E 's#(git@[^:]+:|https://[^/]+/|http://[^/]+/)##; s#\.git$##; s#.*/##')"
	[[ -n "$remote_name" ]] && PROJECT_NAME="$(printf '%s\n' "$remote_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9._-]/-/g')"
fi

log_step 3 5 "Analyzing dependencies & configuring package.json"

CAPTURE="$temp_dir/package-data.json"
export CAPTURE
TARGET_DIR_ENV="$TARGET_DIR" PROJECT_NAME_ENV="$PROJECT_NAME" ORIGIN_URL_ENV="$ORIGIN_URL" node <<'NODE' >"$CAPTURE"
const fs = require("fs");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const projectName = process.env.PROJECT_NAME_ENV;
const originUrl = process.env.ORIGIN_URL_ENV;

function packageNameFromOrigin(url) {
	if (!url) return null;
	let match = url.match(/github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/);
	return match ? match[1].split("/").pop() : null;
}

const originName = packageNameFromOrigin(originUrl);

const data = {
	name: originName
		? originName.toLowerCase().replace(/[^a-z0-9._-]/g, "-")
		: projectName,
	description: pkg.description,
	scripts: pkg.scripts || {},
	type: pkg.type,
	main: pkg.main,
	keywords: pkg.keywords,
	author: pkg.author,
	license: pkg.license,
	overrides: pkg.overrides,
	packageManager: pkg.packageManager || "pnpm@12.21.0",
	devEngines: pkg.devEngines,
	dependencies: [],
	devDependencies: []
};

function splitAliasSpec(spec) {
	if (!spec.startsWith("npm:")) return null;
	const aliasSpec = spec.slice(4);
	const scoped = aliasSpec.startsWith("@");
	const separator = scoped ? aliasSpec.indexOf("@", 1) : aliasSpec.indexOf("@");
	if (separator === -1) return aliasSpec;
	return aliasSpec.slice(0, separator);
}

function captureDependencies(source, saveType) {
	for (const [name, spec] of Object.entries(source || {})) {
		const aliasName = splitAliasSpec(spec);
		data[saveType].push(
			aliasName
				? { name, spec: `${name}@npm:${aliasName}@latest` }
				: { name, spec: `${name}@latest` }
		);
	}
}

captureDependencies(pkg.dependencies, "dependencies");
captureDependencies(pkg.devDependencies, "devDependencies");
process.stdout.write(JSON.stringify(data));
NODE

log_info "Rebuilding clean package.json..."
rm -f package.json pnpm-lock.yaml
rm -rf "$TARGET_DIR/node_modules"
$PNPM init >/dev/null 2>&1 || $PNPM init

node <<'NODE'
const fs = require("fs");

const data = JSON.parse(fs.readFileSync(process.env.CAPTURE, "utf8"));
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

pkg.name = data.name;
if (data.description) pkg.description = data.description;
if (data.scripts) pkg.scripts = data.scripts;
if (data.type) pkg.type = data.type;
if (data.main) pkg.main = data.main;
if (data.keywords) pkg.keywords = data.keywords;
if (data.author) pkg.author = data.author;
if (data.license) pkg.license = data.license;
if (data.overrides) pkg.overrides = data.overrides;
pkg.packageManager = data.packageManager;
if (data.devEngines) pkg.devEngines = data.devEngines;

delete pkg.version;
fs.writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
NODE
log_success "Updated project metadata for $PROJECT_NAME"

log_step 4 5 "Installing latest dependency versions"
export PNPM
node <<'NODE'
const fs = require("fs");
const { spawnSync } = require("child_process");

const data = JSON.parse(fs.readFileSync(process.env.CAPTURE, "utf8"));
const pnpm = process.env.PNPM || "pnpm";
const pnpmArgs = pnpm.includes(" ") ? pnpm.split(/\s+/) : [pnpm];
const useColor = process.env.USE_COLOR === "1";

const cyan = useColor ? "\x1b[36m" : "";
const dim = useColor ? "\x1b[2m" : "";
const bold = useColor ? "\x1b[1m" : "";
const reset = useColor ? "\x1b[0m" : "";

function add(items, dev) {
	if (items.length === 0) return;
	const label = dev ? "Dev dependencies" : "Runtime dependencies";
	const names = items.map(i => i.name).join(", ");
	console.log(`  ${cyan}❯${reset} ${bold}${label}${reset} ${dim}(${items.length} packages)${reset}: ${dim}${names}${reset}`);
	const specs = items.map(i => i.spec);
	const args = [...pnpmArgs.slice(1), "add", ...(dev ? ["--save-dev"] : []), ...specs];
	const command = pnpmArgs[0];
	const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
	if (result.status !== 0) process.exit(result.status || 1);
}

add(data.dependencies, false);
add(data.devDependencies, true);
NODE

ORIGIN_URL="$ORIGIN_URL" node <<'NODE'
const fs = require("fs");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const origin = process.env.ORIGIN_URL || "";
let ownerRepo = null;

let match = origin.match(/github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/);
if (match) ownerRepo = match[1];

if (ownerRepo) {
	pkg.repository = {
		type: "git",
		url: `git+https://github.com/${ownerRepo}.git`
	};
	pkg.bugs = { url: `https://github.com/${ownerRepo}/issues` };
	pkg.homepage = `https://github.com/${ownerRepo}#readme`;
} else {
	delete pkg.repository;
	delete pkg.bugs;
	delete pkg.homepage;
}

fs.writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
NODE

log_info "Finalizing dependencies and lockfile..."
$PNPM install --no-frozen-lockfile >/dev/null 2>&1 || $PNPM install --no-frozen-lockfile

log_step 5 5 "Validating TypeScript build and types"

if $PNPM run typecheck >/dev/null 2>&1; then
	log_info "Running typecheck..."
	$PNPM typecheck
	log_success "Typecheck passed"
else
	log_info "Skipping typecheck (script not present)"
fi

if $PNPM run build >/dev/null 2>&1; then
	log_info "Running build..."
	$PNPM build
	log_success "Build completed successfully"
else
	log_info "Skipping build (script not present)"
fi

rollback=0

# Summary & Next Steps
printf "\n${GREEN}${BOLD}✔ Setup completed successfully!${RESET}\n\n"
printf "${BOLD}Project Summary:${RESET}\n"
printf "  ${DIM}•${RESET} ${BOLD}Name:${RESET}      %s\n" "$PROJECT_NAME"
printf "  ${DIM}•${RESET} ${BOLD}Location:${RESET}  %s\n" "$TARGET_DIR"
printf "  ${DIM}•${RESET} ${BOLD}Mode:${RESET}      %s\n" "$mode"
if [[ -n "$ORIGIN_URL" ]]; then
	printf "  ${DIM}•${RESET} ${BOLD}Remote:${RESET}    %s\n" "$ORIGIN_URL"
else
	printf "  ${DIM}•${RESET} ${BOLD}Remote:${RESET}    ${DIM}not configured${RESET}\n"
fi

printf "\n${CYAN}${BOLD}Next Steps:${RESET}\n"
if [[ "$mode" == "standalone" ]]; then
	printf "  ${BOLD}1.${RESET} cd %s\n" "$TARGET_DIR"
	printf "  ${BOLD}2.${RESET} Edit ${YELLOW}.env${RESET} with your bot token & guild IDs\n"
	printf "  ${BOLD}3.${RESET} Run ${GREEN}pnpm deploy${RESET} to register slash commands\n"
	printf "  ${BOLD}4.${RESET} Run ${GREEN}pnpm dev${RESET} to start development\n\n"
else
	printf "  ${BOLD}1.${RESET} Edit ${YELLOW}.env${RESET} if you updated bot settings\n"
	printf "  ${BOLD}2.${RESET} Run ${GREEN}pnpm deploy${RESET} to register slash commands\n"
	printf "  ${BOLD}3.${RESET} Run ${GREEN}pnpm dev${RESET} to start development\n\n"
fi
